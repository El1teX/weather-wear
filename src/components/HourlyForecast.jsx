import { useCallback, useEffect, useRef, useState } from 'react';
import MiniIcon from './MiniIcon';
import { precipitationHint } from '../utils/hourly';

const signed = (n) => {
  const r = Math.round(n);
  return r > 0 ? `+${r}` : `${r}`;
};

/**
 * Лента прогноза на 24 часа с подсказкой об осадках.
 * Листается пальцем, колесом мыши, перетаскиванием мышью и кнопками-стрелками.
 */
export default function HourlyForecast({ weather }) {
  const hours = weather.hourly ?? [];
  const listRef = useRef(null);
  const drag = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const updateEdges = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft <= 2,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2,
    });
  }, []);

  // При смене города прокручиваем ленту в начало
  useEffect(() => {
    listRef.current?.scrollTo({ left: 0 });
    updateEdges();
  }, [weather.time, updateEdges]);

  // Вертикальное колесо мыши листает ленту по горизонтали
  useEffect(() => {
    const el = listRef.current;
    if (!el) return undefined;
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const canScroll =
        (e.deltaY > 0 && el.scrollLeft + el.clientWidth < el.scrollWidth - 1) ||
        (e.deltaY < 0 && el.scrollLeft > 0);
      if (!canScroll) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [hours.length]);

  // Перетаскивание мышью
  function onPointerDown(e) {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    drag.current = { x: e.clientX, left: listRef.current.scrollLeft, moved: false };
  }
  function onPointerMove(e) {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 4) {
      d.moved = true;
      listRef.current.classList.add('is-dragging');
    }
    listRef.current.scrollLeft = d.left - dx;
  }
  function endDrag() {
    drag.current = null;
    listRef.current?.classList.remove('is-dragging');
  }

  function scrollByCards(dir) {
    const el = listRef.current;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  }

  if (hours.length < 2) return null;
  const hint = precipitationHint(hours, weather.code);

  return (
    <section className="block" aria-labelledby="hourly-title">
      <div className="block__head">
        <h2 id="hourly-title" className="block__title">
          <span aria-hidden="true">🕒</span> По часам
        </h2>
        <div className="scroll-btns">
          <button type="button" className="scroll-btn" onClick={() => scrollByCards(-1)} disabled={edges.start} aria-label="Предыдущие часы">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button type="button" className="scroll-btn" onClick={() => scrollByCards(1)} disabled={edges.end} aria-label="Следующие часы">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>
      {hint && (
        <p className={`hint hint--${hint.tone}`}>
          <span aria-hidden="true">{hint.tone === 'good' ? '🙌' : '☂️'}</span>
          {hint.text}
        </p>
      )}

      <ol
        className="hours"
        ref={listRef}
        aria-label="Прогноз на 24 часа"
        tabIndex={0}
        onScroll={updateEdges}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') scrollByCards(1);
          if (e.key === 'ArrowLeft') scrollByCards(-1);
        }}
      >
        {hours.map((h, i) => (
          <li key={h.time} className={`hour${i === 0 ? ' hour--now' : ''}`} style={{ '--i': Math.min(i, 8) }}>
            <span className="hour__time">{i === 0 ? 'Сейчас' : h.time.slice(11, 16)}</span>
            <MiniIcon code={h.code} isDay={h.isDay} />
            <span className="hour__temp">{signed(i === 0 ? weather.temperature : h.temp)}°</span>
            <span className={`hour__pop${h.pop >= 20 ? '' : ' is-empty'}`}>{h.pop >= 20 ? `💧${h.pop}%` : '—'}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
