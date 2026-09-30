import { useCallback, useEffect, useState } from 'react';
import CitySearch, { cityLabel } from './components/CitySearch';
import CurrentWeather from './components/CurrentWeather';
import ClothingAdvice from './components/ClothingAdvice';
import DayWish from './components/DayWish';
import WeatherDetails from './components/WeatherDetails';
import WeatherScene from './components/WeatherScene';
import { LocateIcon, SearchIcon } from './components/Icons';
import { useWeather } from './hooks/useWeather';
import { useSavedCity } from './hooks/useSavedCity';
import { useLocate } from './hooks/useLocate';
import { skyTheme } from './utils/weatherCodes';
import { SKY } from './utils/sky';
import { haptic, openLink, setChromeColors } from './telegram';

export default function App() {
  const { ready, city, recents, setCity } = useSavedCity();
  const { weather, status, updatedAt, refresh } = useWeather(city);
  const [pickerOpen, setPickerOpen] = useState(false);

  const selectCity = useCallback(
    (c) => {
      setCity(c);
      setPickerOpen(false);
    },
    [setCity]
  );
  const geo = useLocate(selectCity);
  const closePicker = useCallback(() => setPickerOpen(false), []);

  const skyKey = weather ? skyTheme(weather.code, weather.isDay) : 'idle';
  const sky = SKY[skyKey];

  useEffect(() => {
    setChromeColors(sky.top);
  }, [sky.top]);

  function openPicker() {
    haptic.tap();
    setPickerOpen(true);
  }

  function onRefresh() {
    haptic.tap();
    refresh();
  }

  const loading = city && status === 'loading' && !weather;

  return (
    <div className="app" data-sky={skyKey}>
      <header
        className="hero"
        style={{
          '--sky-top': sky.top,
          '--sky-bottom': sky.bottom,
          '--sky-ink': sky.ink,
          '--sky-shadow': sky.shadow,
        }}
      >
        <WeatherScene code={weather?.code} isDay={weather?.isDay ?? true} />
        {city ? (
          <CurrentWeather
            cityName={city.name}
            weather={weather}
            updatedAt={updatedAt}
            onPickCity={openPicker}
            onRefresh={onRefresh}
            refreshing={status === 'loading'}
          />
        ) : (
          <div className="hero__content hero__content--welcome">
            <p className="hero__brand">Что надеть</p>
            <h1 className="hero__welcome">Какая погода у вас?</h1>
          </div>
        )}
      </header>

      <main className="sheet" key={city ? `${city.latitude},${city.longitude}` : 'empty'}>
        {!ready && <p className="sheet__status">Загружаем…</p>}

        {ready && !city && (
          <section className="welcome">
            <p className="welcome__text">
              Покажем погоду прямо сейчас, подскажем, что надеть, и пожелаем хорошего дня.
            </p>
            <button
              type="button"
              className="primary-btn"
              onClick={geo.locate}
              disabled={geo.status === 'locating'}
            >
              <LocateIcon />
              {geo.status === 'locating' ? 'Определяем…' : 'Моё местоположение'}
            </button>
            <button type="button" className="secondary-btn" onClick={openPicker}>
              <SearchIcon />
              Выбрать город
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
          </section>
        )}

        {loading && <p className="sheet__status" role="status">Загружаем погоду для {city.name}…</p>}

        {status === 'error' && !weather && (
          <div className="notice notice--block" role="alert">
            <p>Не удалось загрузить погоду. Проверьте подключение к интернету.</p>
            <button type="button" className="secondary-btn" onClick={onRefresh}>
              Попробовать снова
            </button>
          </div>
        )}

        {weather && (
          <>
            <DayWish weather={weather} cityName={city.name} />
            <ClothingAdvice weather={weather} />
            <WeatherDetails weather={weather} />
            <p className="credit">
              {cityLabel(city)}. Данные{' '}
              <button type="button" className="link-btn" onClick={() => openLink('https://open-meteo.com/')}>
                Open-Meteo
              </button>
            </p>
          </>
        )}
      </main>

      <CitySearch open={pickerOpen} onClose={closePicker} onSelect={selectCity} recents={recents} />
    </div>
  );
}
