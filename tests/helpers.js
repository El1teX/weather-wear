// Сборка тестовых данных о погоде в формате, который отдаёт fetchWeather
export function makeWeather(overrides = {}) {
  const { today, ...rest } = overrides;
  return {
    time: '2026-09-30T14:00',
    temperature: 15,
    feelsLike: 15,
    humidity: 60,
    precipitation: 0,
    code: 0,
    wind: 3,
    gusts: 5,
    isDay: true,
    today: { max: 17, min: 10, precipChance: 0, uvMax: 2, sunrise: '2026-09-30T07:00', sunset: '2026-09-30T18:40', ...today },
    hourly: [],
    ...rest,
  };
}

export function makeHours(list) {
  return list.map(([hour, code, pop = 0], i) => ({
    time: `2026-09-30T${String(hour).padStart(2, '0')}:00`,
    temp: 10 + i,
    code,
    pop,
    isDay: hour >= 7 && hour < 19,
  }));
}
