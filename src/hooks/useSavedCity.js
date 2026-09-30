import { useEffect, useState } from 'react';

const STORAGE_KEY = 'weather-wear:city';

function readSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const city = JSON.parse(raw);
    const valid =
      city &&
      typeof city.name === 'string' &&
      Number.isFinite(city.latitude) &&
      Number.isFinite(city.longitude);
    return valid ? city : null;
  } catch {
    return null;
  }
}

/** Выбранный город, который сохраняется между визитами. */
export function useSavedCity() {
  const [city, setCity] = useState(readSaved);

  useEffect(() => {
    if (!city) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(city));
    } catch {
      // Хранилище недоступно (приватный режим) — просто не запоминаем.
    }
  }, [city]);

  return [city, setCity];
}
