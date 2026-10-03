const minutesOf = (iso) => Number(iso.slice(11, 13)) * 60 + Number(iso.slice(14, 16));
const clock = (iso) => iso.slice(11, 16);

function uvLevel(uv) {
  if (uv < 3) return 'низкий';
  if (uv < 6) return 'умеренный';
  if (uv < 8) return 'высокий';
  if (uv < 11) return 'очень высокий';
  return 'экстремальный';
}

/** Дуга солнца: где солнце сейчас между восходом и закатом */
function SunPath({ sunrise, sunset, now }) {
  const rise = minutesOf(sunrise);
  const set = minutesOf(sunset);
  const cur = minutesOf(now);
  const t = Math.min(1, Math.max(0, (cur - rise) / (set - rise)));
  const up = cur >= rise && cur <= set;
  // Точка на полуокружности от (20,70) до (220,70) с вершиной на высоте 60
  const angle = Math.PI * (1 - t);
  const x = 120 + 100 * Math.cos(angle);
  const y = 70 - 60 * Math.sin(angle);

  return (
    <div className="tile tile--wide" data-tone="sun">
      <span className="tile__emoji" aria-hidden="true">🌇</span>
      <p className="tile__label">Солнце</p>
      <svg viewBox="0 0 240 84" className="sunpath" aria-hidden="true">
        <path d="M20 70 A100 60 0 0 1 220 70" className="sunpath__track" />
        <path
          d="M20 70 A100 60 0 0 1 220 70"
          className="sunpath__done"
          pathLength="1"
          strokeDasharray={`${t} 1`}
        />
        <line x1="8" y1="70" x2="232" y2="70" className="sunpath__horizon" />
        {up && <circle cx={x} cy={y} r="7" className="sunpath__sun" />}
      </svg>
      <div className="sunpath__times">
        <span>Восход {clock(sunrise)}</span>
        <span>Закат {clock(sunset)}</span>
      </div>
    </div>
  );
}

export default function WeatherDetails({ weather }) {
  const { today } = weather;
  const uv = Math.round(today.uvMax ?? 0);

  return (
    <section className="block" aria-labelledby="details-title">
      <h2 id="details-title" className="block__title">
        <span aria-hidden="true">📊</span> Подробнее
      </h2>
      <div className="tiles">
        <div className="tile" data-tone="wind">
          <span className="tile__emoji" aria-hidden="true">💨</span>
          <p className="tile__label">Ветер</p>
          <p className="tile__value">{Math.round(weather.wind)} м/с</p>
          <p className="tile__sub">порывы до {Math.round(weather.gusts)} м/с</p>
        </div>
        <div className="tile" data-tone="rain">
          <span className="tile__emoji" aria-hidden="true">☔</span>
          <p className="tile__label">Осадки сегодня</p>
          <p className="tile__value">{today.precipChance ?? 0}%</p>
          <p className="tile__sub">вероятность</p>
        </div>
        <div className="tile" data-tone="water">
          <span className="tile__emoji" aria-hidden="true">💧</span>
          <p className="tile__label">Влажность</p>
          <p className="tile__value">{weather.humidity}%</p>
          <div className="meter" aria-hidden="true">
            <span style={{ width: `${weather.humidity}%` }} />
          </div>
        </div>
        <div className="tile" data-tone="uv">
          <span className="tile__emoji" aria-hidden="true">😎</span>
          <p className="tile__label">УФ-индекс</p>
          <p className="tile__value">{uv}</p>
          <p className="tile__sub">{uvLevel(uv)}</p>
        </div>
        {today.sunrise && today.sunset && (
          <SunPath sunrise={today.sunrise} sunset={today.sunset} now={weather.time} />
        )}
      </div>
    </section>
  );
}
