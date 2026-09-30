import { useEffect, useId, useRef, useState } from 'react';
import { reverseGeocode, searchCities } from '../api/weather';

const DEBOUNCE_MS = 350;

function cityLabel(c) {
  return [c.name, c.admin1 !== c.name ? c.admin1 : null, c.country]
    .filter(Boolean)
    .join(', ');
}

export default function CitySearch({ onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [status, setStatus] = useState('idle'); // idle | loading | empty | error
  const [geo, setGeo] = useState({ status: 'idle', message: '' }); // idle | locating | error
  const listId = useId();
  const wrapRef = useRef(null);
  const geoSupported = typeof navigator !== 'undefined' && 'geolocation' in navigator;

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setStatus('idle');
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setStatus('loading');
      try {
        const found = await searchCities(q, controller.signal);
        setResults(found);
        setActive(found.length ? 0 : -1);
        setStatus(found.length ? 'idle' : 'empty');
        setOpen(true);
      } catch (e) {
        if (e.name !== 'AbortError') setStatus('error');
      }
    }, DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    function onClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function choose(city) {
    onSelect(city);
    setQuery('');
    setResults([]);
    setOpen(false);
  }

  function locate() {
    setGeo({ status: 'locating', message: '' });
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const city = await reverseGeocode({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
        setGeo({ status: 'idle', message: '' });
        choose(city);
      },
      (err) => {
        const message =
          err.code === err.PERMISSION_DENIED
            ? 'Доступ к местоположению запрещён. Разрешите его в настройках браузера или найдите город вручную.'
            : 'Не удалось определить местоположение. Найдите город вручную.';
        setGeo({ status: 'error', message });
      },
      { timeout: 10000, maximumAge: 10 * 60 * 1000 }
    );
  }

  function onKeyDown(e) {
    if (!open || !results.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === 'Enter' && active >= 0) {
      e.preventDefault();
      choose(results[active]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  const showList = open && (results.length > 0 || status === 'empty');

  return (
    <div className="search" ref={wrapRef}>
      <label className="search__label" htmlFor={`${listId}-input`}>
        Город
      </label>
      <input
        id={`${listId}-input`}
        className="search__input"
        type="search"
        placeholder="Например, Рига"
        autoComplete="off"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length && setOpen(true)}
        onKeyDown={onKeyDown}
      />
      {status === 'loading' && <span className="search__hint">Ищем…</span>}
      {status === 'error' && (
        <span className="search__hint search__hint--error">
          Поиск недоступен. Проверьте подключение к интернету.
        </span>
      )}
      {geoSupported && (
        <button
          type="button"
          className="link-btn search__geo"
          onClick={locate}
          disabled={geo.status === 'locating'}
        >
          {geo.status === 'locating' ? 'Определяем местоположение…' : 'Определить моё местоположение'}
        </button>
      )}
      {geo.status === 'error' && (
        <span className="search__hint search__hint--error" role="alert">{geo.message}</span>
      )}
      {showList && (
        <ul className="search__list" id={listId} role="listbox">
          {status === 'empty' && (
            <li className="search__empty">Город не найден. Попробуйте другое написание.</li>
          )}
          {results.map((c, i) => (
            <li
              key={c.id}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              className={`search__option${i === active ? ' is-active' : ''}`}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => {
                e.preventDefault();
                choose(c);
              }}
            >
              {cityLabel(c)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export { cityLabel };
