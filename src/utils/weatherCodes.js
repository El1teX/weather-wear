// Коды погоды WMO, которые возвращает Open-Meteo.
// sky — группа для цветовой темы страницы.
const CODES = {
  0: { text: 'Ясно', sky: 'clear' },
  1: { text: 'Преимущественно ясно', sky: 'clear' },
  2: { text: 'Переменная облачность', sky: 'clouds' },
  3: { text: 'Пасмурно', sky: 'clouds' },
  45: { text: 'Туман', sky: 'fog' },
  48: { text: 'Туман с изморозью', sky: 'fog' },
  51: { text: 'Слабая морось', sky: 'rain' },
  53: { text: 'Морось', sky: 'rain' },
  55: { text: 'Сильная морось', sky: 'rain' },
  56: { text: 'Ледяная морось', sky: 'rain' },
  57: { text: 'Сильная ледяная морось', sky: 'rain' },
  61: { text: 'Небольшой дождь', sky: 'rain' },
  63: { text: 'Дождь', sky: 'rain' },
  65: { text: 'Сильный дождь', sky: 'rain' },
  66: { text: 'Ледяной дождь', sky: 'rain' },
  67: { text: 'Сильный ледяной дождь', sky: 'rain' },
  71: { text: 'Небольшой снег', sky: 'snow' },
  73: { text: 'Снег', sky: 'snow' },
  75: { text: 'Сильный снег', sky: 'snow' },
  77: { text: 'Снежная крупа', sky: 'snow' },
  80: { text: 'Небольшой ливень', sky: 'rain' },
  81: { text: 'Ливень', sky: 'rain' },
  82: { text: 'Сильный ливень', sky: 'rain' },
  85: { text: 'Снегопад', sky: 'snow' },
  86: { text: 'Сильный снегопад', sky: 'snow' },
  95: { text: 'Гроза', sky: 'storm' },
  96: { text: 'Гроза с градом', sky: 'storm' },
  99: { text: 'Сильная гроза с градом', sky: 'storm' },
};

export function describeWeather(code) {
  return CODES[code] ?? { text: 'Нет данных', sky: 'clouds' };
}

/** Тема страницы: ночью ясное и облачное небо становится ночным. */
export function skyTheme(code, isDay) {
  const { sky } = describeWeather(code);
  if (!isDay && (sky === 'clear' || sky === 'clouds')) return 'night';
  return sky;
}

export const isRainy = (code) => describeWeather(code).sky === 'rain' || describeWeather(code).sky === 'storm';
export const isSnowy = (code) => describeWeather(code).sky === 'snow';
