import { useEffect, useId, useRef, useState } from 'react';
import { searchCities } from '../api/weather';
import { useLocate } from '../hooks/useLocate';
import { haptic, showBackButton } from '../telegram';
import { CloseIcon, LocateIcon, SearchIcon } from './Icons';

const DEBOUNCE_MS = 350;

export function cityLabel(c) {
  return [c.name, c.admin1 !== c.name ? c.admin1 : null, c.country].filter(Boolean).join(', ');
}

/** Экран выбора города: поиск, моё местоположение и недавние города */
export default function CitySearch({ open, onClose, onSelect, recents }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | loading | empty | error
  const [active, setActive] = useState(-1);
  const inputRef = useRef(null);
  const listId = useId();
  const geo = useLocate(choose);

  function choose(city) {
    haptic.select();
    onSelect(city);
    setQuery('');
    setResults([]);
  }

  // Системная кнопка «Назад» в Telegram и Esc
  useEffect(() => {
    if (!open) return undefined;
    const hideBack = showBackButton(onClose);
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.classList.add('no-scroll');
    const t = setTimeout(() => inputRef.current?.focus(), 250);
    return () => {
      hideBack();
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('no-scroll');
      clearTimeout(t);
    };
  }, [open, onClose]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setStatus('idle');
      return undefined;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setStatus('loading');
      try {
        const found = await searchCities(q, controller.signal);
        setResults(found);
        setActive(found.length ? 0 : -1);
        setStatus(found.length ? 'idle' : 'empty');
      } catch (e) {
        if (e.name !== 'AbortError') setStatus('error');
      }
    }, DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  function onKeyDown(e) {
    if (!results.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === 'Enter' && active >= 0) {
      e.preventDefault();
      choose(results[active]);
    }
  }

  if (!open) return null;

  const showRecents = query.trim().length < 2 && recents.length > 0;

  return (
    <div className="picker" role="dialog" aria-modal="true" aria-labelledby={`${listId}-title`}>
      <div className="picker__backdrop" onClick={onClose} />
      <div className="picker__sheet">
        <div className="picker__head">
          <h2 id={`${listId}-title`} className="picker__title">Выбор города</h2>
          <button type="button" className="plain-btn" onClick={onClose} aria-label="Закрыть">
            <CloseIcon />
          </button>
        </div>

        <label className="field">
          <SearchIcon />
          <input
            ref={inputRef}
            className="field__input"
            type="search"
            placeholder="Название города"
            autoComplete="off"
            enterKeyHint="search"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls={listId}
            aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
          />
        </label>

        <button
          type="button"
          className="row-btn"
          onClick={geo.locate}
          disabled={geo.status === 'locating'}
        >
          <span className="row-btn__icon"><LocateIcon /></span>
          {geo.status === 'locating' ? 'Определяем местоположение…' : 'Моё местоположение'}
        </button>
        {geo.status === 'error' && (
          <p className="notice" role="alert">
            {geo.message}{' '}
            {geo.canFix && (
              <button type="button" className="link-btn" onClick={geo.openSettings}>
                Открыть настройки
              </button>
            )}
          </p>
        )}

        {status === 'loading' && <p className="picker__hint">Ищем…</p>}
        {status === 'empty' && (
          <p className="picker__hint">Такой город не найден. Проверьте написание.</p>
        )}
        {status === 'error' && (
          <p className="notice" role="alert">Поиск недоступен. Проверьте подключение к интернету.</p>
        )}

        {results.length > 0 && (
          <ul className="list" id={listId} role="listbox">
            {results.map((c, i) => (
              <li
                key={c.id}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                className={`list__item${i === active ? ' is-active' : ''}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(c)}
              >
                <span className="list__name">{c.name}</span>
                <span className="list__sub">{[c.admin1 !== c.name && c.admin1, c.country].filter(Boolean).join(', ')}</span>
              </li>
            ))}
          </ul>
        )}

        {showRecents && (
          <>
            <h3 className="picker__section">Недавние</h3>
            <ul className="list">
              {recents.map((c) => (
                <li key={`${c.latitude},${c.longitude}`}>
                  <button type="button" className="list__item list__btn" onClick={() => choose(c)}>
                    <span className="list__name">{c.name}</span>
                    <span className="list__sub">{[c.admin1 !== c.name && c.admin1, c.country].filter(Boolean).join(', ')}</span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
