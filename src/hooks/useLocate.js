import { useCallback, useState } from 'react';
import { reverseGeocode } from '../api/weather';
import {
  LocationError,
  canOpenLocationSettings,
  haptic,
  openLocationSettings,
  requestLocation,
} from '../telegram';

const MESSAGES = {
  denied: 'Нет доступа к местоположению. Разрешите его или выберите город вручную.',
  unavailable: 'Не удалось определить местоположение. Выберите город вручную.',
};

/** Определение города пользователя с понятными ошибками */
export function useLocate(onFound) {
  const [state, setState] = useState({ status: 'idle', message: '', canFix: false });

  const locate = useCallback(async () => {
    setState({ status: 'locating', message: '', canFix: false });
    try {
      const coords = await requestLocation();
      const city = await reverseGeocode(coords);
      setState({ status: 'idle', message: '', canFix: false });
      haptic.success();
      onFound(city);
    } catch (e) {
      const reason = e instanceof LocationError ? e.reason : 'unavailable';
      haptic.error();
      setState({
        status: 'error',
        message: MESSAGES[reason],
        canFix: reason === 'denied' && canOpenLocationSettings(),
      });
    }
  }, [onFound]);

  return { ...state, locate, openSettings: openLocationSettings };
}
