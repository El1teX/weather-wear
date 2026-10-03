import { useCallback, useEffect, useState } from 'react';
import { getItem, setItem } from '../utils/storage';
import { DEFAULT_PET, isPet } from '../utils/mascot';

const PET_KEY = 'weather_wear_pet';

/** Выбранное животное-спутник. Сохраняется между запусками. */
export function usePet() {
  const [pet, setPetState] = useState(DEFAULT_PET);

  useEffect(() => {
    let alive = true;
    getItem(PET_KEY).then((saved) => {
      if (alive && isPet(saved)) setPetState(saved);
    });
    return () => {
      alive = false;
    };
  }, []);

  const setPet = useCallback((id) => {
    if (!isPet(id)) return;
    setPetState(id);
    setItem(PET_KEY, id);
  }, []);

  return [pet, setPet];
}
