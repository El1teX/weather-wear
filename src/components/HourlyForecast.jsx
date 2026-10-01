import { useEffect, useRef } from 'react';
import MiniIcon from './MiniIcon';
import { precipitationHint } from '../utils/hourly';

const signed = (n) => {
  const r = Math.round(n);
  return r > 0 ? `+${r}` : `${r}`;
};

/** Лента прогноза на 24 часа с подсказкой об осадках */
export default function HourlyForecast({ weather }) {
  const hours = weather.hourly ?? [];
  const listRef = useRef(null);

  // При смене города прокручиваем ленту в начало
  useEffect(() => {
    listRef.current?.scrollTo({ left: 0 });
  }, [weather.time]);

  if (hours.length < 2) return null;
  const hint = precipitationHint(hours, weather.code);

  return (
    <section className="block" aria-labelledby="hourly-title">
      <h2 id="hourly-title" className="block__title">По часам</h2>
      {hint && (
        <p className={`hint hint--${hint.tone}`}>
          <span aria-hidden="true">{hint.tone === 'good' ? '🙌' : '☂️'}</span>
          {hint.text}
        </p>
      )}

      <ol className="hours" ref={listRef} aria-label="Прогноз на 24 часа">
        {hours.map((h, i) => (
          <li
            key={h.time}
            className={`hour${i === 0 ? ' hour--now' : ''}`}
            style={{ '--i': Math.min(i, 8) }}
          >
            <span className="hour__time">{i === 0 ? 'Сейчас' : h.time.slice(11, 16)}</span>
            <MiniIcon code={h.code} isDay={h.isDay} />
            <span className="hour__temp">{signed(i === 0 ? weather.temperature : h.temp)}°</span>
            <span className={`hour__pop${h.pop >= 20 ? '' : ' is-empty'}`}>
              {h.pop >= 20 ? `💧${h.pop}%` : '—'}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
