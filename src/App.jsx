import { useEffect, useState } from 'react';
import CitySearch, { cityLabel } from './components/CitySearch';
import CurrentWeather from './components/CurrentWeather';
import { useWeather } from './hooks/useWeather';
import { skyTheme } from './utils/weatherCodes';

export default function App() {
  const [city, setCity] = useState(null);
  const { weather, status, updatedAt, refresh } = useWeather(city);

  // Тема страницы следует за погодой
  useEffect(() => {
    document.documentElement.dataset.sky = weather
      ? skyTheme(weather.code, weather.isDay)
      : 'idle';
  }, [weather]);

  return (
    <main className="page">
      <header className="header">
        <h1 className="title">Что надеть</h1>
        <CitySearch onSelect={setCity} />
      </header>

      {!city && (
        <p className="empty">
          Найдите свой город — покажем погоду прямо сейчас и подскажем, как одеться.
        </p>
      )}

      {city && status === 'loading' && !weather && (
        <p className="empty" role="status">Загружаем погоду для {city.name}…</p>
      )}

      {status === 'error' && (
        <p className="error" role="alert">
          Не удалось загрузить погоду. Проверьте подключение к интернету и{' '}
          <button type="button" className="link-btn" onClick={refresh}>попробуйте снова</button>.
        </p>
      )}

      {weather && (
        <CurrentWeather
          cityName={cityLabel(city)}
          weather={weather}
          updatedAt={updatedAt}
          onRefresh={refresh}
          refreshing={status === 'loading'}
        />
      )}

      <footer className="footer">
        Данные: <a href="https://open-meteo.com/">Open-Meteo.com</a>
      </footer>
    </main>
  );
}
