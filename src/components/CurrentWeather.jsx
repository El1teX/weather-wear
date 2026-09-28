import { describeWeather } from '../utils/weatherCodes';

const round = (n) => Math.round(n);
const signed = (n) => {
  const r = round(n);
  return r > 0 ? `+${r}` : `${r}`;
};
const timeFmt = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' });

export default function CurrentWeather({ cityName, weather, updatedAt, onRefresh, refreshing }) {
  const { text } = describeWeather(weather.code);
  const t = weather.today;

  return (
    <section className="now" aria-labelledby="now-city">
      <h2 id="now-city" className="now__city">{cityName}</h2>

      <div className="now__main">
        <p className="now__temp" aria-label={`Температура ${signed(weather.temperature)} градусов`}>
          {signed(weather.temperature)}
          <span className="now__deg">°</span>
        </p>
        <div className="now__summary">
          <p className="now__condition">{text}</p>
          <p className="now__range">
            днём до {signed(t.max)}°, ночью до {signed(t.min)}°
          </p>
        </div>
      </div>

      <dl className="now__details">
        <div>
          <dt>Ощущается</dt>
          <dd>{signed(weather.feelsLike)}°</dd>
        </div>
        <div>
          <dt>Ветер</dt>
          <dd>
            {round(weather.wind)} м/с
            {weather.gusts > weather.wind + 3 && (
              <small>, порывы {round(weather.gusts)}</small>
            )}
          </dd>
        </div>
        <div>
          <dt>Влажность</dt>
          <dd>{weather.humidity}%</dd>
        </div>
        <div>
          <dt>Осадки сегодня</dt>
          <dd>{t.precipChance ?? 0}%</dd>
        </div>
      </dl>

      <p className="now__updated">
        {updatedAt && <>Обновлено в {timeFmt.format(updatedAt)}. </>}
        Данные обновляются каждые 10 минут.{' '}
        <button type="button" className="link-btn" onClick={onRefresh} disabled={refreshing}>
          {refreshing ? 'Обновляем…' : 'Обновить'}
        </button>
      </p>
    </section>
  );
}
