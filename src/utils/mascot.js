import { describeWeather } from './weatherCodes';

// Животные-спутники, из которых выбирает пользователь
export const PETS = [
  { id: 'fox', name: 'Лиса' },
  { id: 'raccoon', name: 'Енот' },
  { id: 'monkey', name: 'Обезьяна' },
];

export const DEFAULT_PET = 'fox';

export const isPet = (id) => PETS.some((p) => p.id === id);

const BASE = {
  hat: null, // 'pompom' | 'beanie' | 'cap' | 'nightcap'
  scarf: false,
  mittens: false,
  umbrella: false,
  boots: false,
  glasses: false,
  mood: 'happy', // 'happy' | 'wow' | 'sleepy' | 'cold' | 'hot'
};

/** Как одет спутник при текущей погоде */
export function getMascotLook(weather) {
  if (!weather) return { ...BASE };

  const hour = Number(weather.time.slice(11, 13));
  const night = hour >= 23 || hour < 5;
  const { sky } = describeWeather(weather.code);
  const t = weather.feelsLike;
  const look = { ...BASE };

  // Одежда по температуре
  if (t <= -10) {
    Object.assign(look, { hat: 'pompom', scarf: true, mittens: true, mood: 'cold' });
  } else if (t <= 3) {
    Object.assign(look, { hat: 'beanie', scarf: true });
  } else if (t >= 27) {
    Object.assign(look, { hat: 'cap', glasses: weather.isDay, mood: 'hot' });
  } else if (t >= 20) {
    look.hat = weather.isDay ? 'cap' : null;
  }

  // Поправки на погоду
  if (sky === 'rain' || sky === 'storm') {
    Object.assign(look, { umbrella: true, boots: true, glasses: false });
    if (look.hat === 'cap') look.hat = null; // под зонтом кепка не нужна
    if (sky === 'storm') look.mood = 'wow';
  } else if (sky === 'snow') {
    Object.assign(look, { hat: look.hat ?? 'beanie', scarf: true, boots: true });
  } else if (sky === 'fog') {
    look.mood = 'wow';
  }

  // Ночью — колпак и сонные глаза (кроме грозы: какой уж тут сон)
  if (night && sky !== 'storm') {
    Object.assign(look, { hat: 'nightcap', glasses: false, mood: 'sleepy' });
  }

  return look;
}
