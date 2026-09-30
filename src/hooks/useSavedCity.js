import { useCallback, useEffect, useState } from 'react';
import { getItem, setItem } from '../utils/storage';

const CITY_KEY = 'weather_wear_city';
const RECENTS_KEY = 'weather_wear_recents';
const MAX_RECENTS = 5;

const isCity = (c) =>
  c && typeof c.name === 'string' && Number.isFinite(c.latitude) && Number.isFinite(c.longitude);

function parse(raw, fallback) {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

// Храним только нужные поля, чтобы укладываться в лимиты CloudStorage.
const compact = ({ id, name, admin1, country, latitude, longitude }) => ({
  id, name, admin1, country, latitude, longitude,
});

const sameCity = (a, b) =>
  Math.abs(a.latitude - b.latitude) < 0.01 && Math.abs(a.longitude - b.longitude) < 0.01;

/** Выбранный город и недавние города. Сохраняются между запусками. */
export function useSavedCity() {
  const [state, setState] = useState({ ready: false, city: null, recents: [] });

  useEffect(() => {
    let alive = true;
    Promise.all([getItem(CITY_KEY), getItem(RECENTS_KEY)]).then(([rawCity, rawRecents]) => {
      if (!alive) return;
      const city = parse(rawCity, null);
      const recents = parse(rawRecents, []);
      setState({
        ready: true,
        city: isCity(city) ? city : null,
        recents: Array.isArray(recents) ? recents.filter(isCity) : [],
      });
    });
    return () => {
      alive = false;
    };
  }, []);

  const setCity = useCallback((next) => {
    const city = compact(next);
    setState((s) => {
      const recents = [city, ...s.recents.filter((c) => !sameCity(c, city))].slice(0, MAX_RECENTS);
      return { ...s, city, recents };
    });
  }, []);

  // Сохраняем после обновления состояния
  useEffect(() => {
    if (!state.ready || !state.city) return;
    setItem(CITY_KEY, JSON.stringify(state.city));
    setItem(RECENTS_KEY, JSON.stringify(state.recents));
  }, [state]);

  return { ...state, setCity };
}
