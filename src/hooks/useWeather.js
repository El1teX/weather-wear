import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchWeather } from '../api/weather';

// Open-Meteo обновляет текущие данные примерно раз в 15 минут,
// опрашиваем чаще, чтобы не пропустить свежие значения.
const REFRESH_MS = 10 * 60 * 1000;

export function useWeather(city) {
  const [weather, setWeather] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | loading | ready | error
  const [updatedAt, setUpdatedAt] = useState(null);
  const controllerRef = useRef(null);

  const load = useCallback(async () => {
    if (!city) return;
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setStatus((s) => (s === 'ready' ? 'ready' : 'loading'));
    try {
      const data = await fetchWeather(city, controller.signal);
      setWeather(data);
      setUpdatedAt(new Date());
      setStatus('ready');
    } catch (e) {
      if (e.name !== 'AbortError') setStatus('error');
    }
  }, [city]);

  useEffect(() => {
    if (!city) return;
    setWeather(null);
    setStatus('loading');
    load();

    const timer = setInterval(load, REFRESH_MS);
    const onVisible = () => {
      if (document.visibilityState === 'visible') load();
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
      controllerRef.current?.abort();
    };
  }, [city, load]);

  return { weather, status, updatedAt, refresh: load };
}
