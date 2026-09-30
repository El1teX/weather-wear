import { describeWeather } from '../utils/weatherCodes';
import { useCountUp } from '../hooks/useCountUp';
import { ChevronIcon, PinIcon, RefreshIcon } from './Icons';

const signed = (n) => {
  const r = Math.round(n);
  return r > 0 ? `+${r}` : `${r}`;
};
const timeFmt = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' });

/** Верхняя часть экрана: город, температура и состояние погоды поверх неба */
export default function CurrentWeather({ cityName, weather, updatedAt, onPickCity, onRefresh, refreshing }) {
  const temp = useCountUp(weather ? weather.temperature : NaN);

  return (
    <div className="hero__content">
      <div className="hero__bar">
        <button type="button" className="glass-btn city-btn" onClick={onPickCity}>
          <PinIcon />
          <span className="city-btn__name">{cityName}</span>
          <ChevronIcon />
        </button>
        {weather && (
          <button
            type="button"
            className={`glass-btn icon-btn${refreshing ? ' is-spinning' : ''}`}
            onClick={onRefresh}
            disabled={refreshing}
            aria-label="Обновить погоду"
          >
            <RefreshIcon />
          </button>
        )}
      </div>

      {weather && (
        <div className="hero__now">
          <p className="hero__temp" aria-label={`Сейчас ${signed(weather.temperature)} градусов`}>
            <span aria-hidden="true">{signed(temp)}°</span>
          </p>
          <p className="hero__condition">{describeWeather(weather.code).text}</p>
          <p className="hero__meta">
            Ощущается как {signed(weather.feelsLike)}°. Днём до {signed(weather.today.max)}°, ночью до{' '}
            {signed(weather.today.min)}°.
          </p>
          {updatedAt && (
            <p className="hero__updated">Обновлено в {timeFmt.format(updatedAt)}</p>
          )}
        </div>
      )}
    </div>
  );
}
