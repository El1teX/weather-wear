const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Поиск городов по названию.
 * @returns {Promise<Array<{id, name, country, admin1, latitude, longitude, timezone}>>}
 */
export async function searchCities(query, signal) {
  const params = new URLSearchParams({
    name: query,
    count: '6',
    language: 'ru',
    format: 'json',
  });
  const res = await fetch(`${GEO_URL}?${params}`, { signal });
  if (!res.ok) throw new Error(`Поиск города не удался (${res.status})`);
  const data = await res.json();
  return (data.results ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    country: c.country,
    admin1: c.admin1,
    latitude: c.latitude,
    longitude: c.longitude,
    timezone: c.timezone,
  }));
}

/**
 * Текущая погода и сводка на сегодня для координат.
 */
export async function fetchWeather({ latitude, longitude }, signal) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: [
      'temperature_2m',
      'apparent_temperature',
      'relative_humidity_2m',
      'precipitation',
      'weather_code',
      'wind_speed_10m',
      'wind_gusts_10m',
      'is_day',
    ].join(','),
    daily: [
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_probability_max',
      'uv_index_max',
      'sunrise',
      'sunset',
    ].join(','),
    wind_speed_unit: 'ms',
    timezone: 'auto',
    forecast_days: '1',
  });

  const res = await fetch(`${FORECAST_URL}?${params}`, { signal });
  if (!res.ok) throw new Error(`Погода не загрузилась (${res.status})`);
  const d = await res.json();
  const c = d.current;
  const day = d.daily;

  return {
    time: c.time,
    temperature: c.temperature_2m,
    feelsLike: c.apparent_temperature,
    humidity: c.relative_humidity_2m,
    precipitation: c.precipitation,
    code: c.weather_code,
    wind: c.wind_speed_10m,
    gusts: c.wind_gusts_10m,
    isDay: c.is_day === 1,
    today: {
      max: day.temperature_2m_max[0],
      min: day.temperature_2m_min[0],
      precipChance: day.precipitation_probability_max[0],
      uvMax: day.uv_index_max[0],
      sunrise: day.sunrise[0],
      sunset: day.sunset[0],
    },
  };
}

const REVERSE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

/**
 * Название места по координатам. Нужно для геолокации:
 * у Open-Meteo нет обратного геокодирования, поэтому используем
 * бесплатный клиентский API BigDataCloud (без ключа).
 */
export async function reverseGeocode({ latitude, longitude }, signal) {
  const base = {
    id: `geo-${latitude.toFixed(3)}-${longitude.toFixed(3)}`,
    name: 'Моё местоположение',
    latitude,
    longitude,
  };
  try {
    const params = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      localityLanguage: 'ru',
    });
    const res = await fetch(`${REVERSE_URL}?${params}`, { signal });
    if (!res.ok) return base;
    const d = await res.json();
    return {
      ...base,
      name: d.city || d.locality || base.name,
      admin1: d.principalSubdivision || undefined,
      country: d.countryName || undefined,
    };
  } catch (e) {
    if (e.name === 'AbortError') throw e;
    // Название не определилось — погоду всё равно показываем по координатам.
    return base;
  }
}
