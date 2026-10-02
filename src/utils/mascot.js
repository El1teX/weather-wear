import { describeWeather } from './weatherCodes';

// Как одет талисман Пончик и что он говорит при текущей погоде.

const PHRASES = {
  hello: ['Привет! Я Пончик 👋', 'Где ты сейчас? Покажу погоду!'],
  night: ['Зева-а-аю… Пора спать', 'Тсс, все уже спят', 'Сладких снов! 🌙'],
  storm: ['Ой, гром! Лучше побудем дома', 'Бр-р, гроза! Держись подальше от деревьев'],
  rain: ['Зонт — мой лучший друг ☂️', 'Шлёп-шлёп по лужам!', 'Не забудь резиновые сапоги'],
  snow: ['Ура, снег! ❄️', 'Слепим снеговика?', 'Осторожно, скользко!'],
  fog: ['Ау! Ничего не вижу…', 'Туман, как в сказке'],
  frost: ['Брр! Варежки не забудь 🧤', 'Нос мёрзнет! Шарф обязательно', 'Холодрыга!'],
  cold: ['Свежо! Шапка не помешает', 'Застегнись повыше'],
  hot: ['Уф, жарко! Где мороженое? 🍦', 'Пей больше воды!', 'В тень, скорее в тень'],
  warm: ['Отличный денёк для прогулки!', 'Солнышко греет ☀️'],
  mild: ['Хорошая погода!', 'Прекрасный день, правда?'],
  clouds: ['Облачно, но уютно ☁️', 'Солнце спряталось, но мы не грустим'],
  windy: ['Ух, ветрено! Держись крепче 💨'],
};

const BASE = {
  hat: null, // 'pompom' | 'beanie' | 'cap' | 'nightcap'
  scarf: false,
  mittens: false,
  umbrella: false,
  boots: false,
  glasses: false,
  mood: 'happy', // 'happy' | 'wow' | 'sleepy' | 'cold' | 'hot'
};

export function getMascotLook(weather) {
  if (!weather) return { ...BASE, phrases: PHRASES.hello };

  const hour = Number(weather.time.slice(11, 13));
  const night = hour >= 23 || hour < 5;
  const { sky } = describeWeather(weather.code);
  const t = weather.feelsLike;
  const windy = weather.wind >= 8 || weather.gusts >= 12;

  const look = { ...BASE };
  let key;

  // Одежда по температуре
  if (t <= -10) {
    Object.assign(look, { hat: 'pompom', scarf: true, mittens: true, mood: 'cold' });
    key = 'frost';
  } else if (t <= 3) {
    Object.assign(look, { hat: 'beanie', scarf: true });
    key = 'cold';
  } else if (t >= 27) {
    Object.assign(look, { hat: 'cap', glasses: weather.isDay, mood: 'hot' });
    key = 'hot';
  } else if (t >= 20) {
    look.hat = weather.isDay ? 'cap' : null;
    key = 'warm';
  } else {
    key = sky === 'clouds' ? 'clouds' : 'mild';
  }

  // Поправки на погоду
  if (sky === 'rain' || sky === 'storm') {
    Object.assign(look, { umbrella: true, boots: true, glasses: false });
    if (look.hat === 'cap') look.hat = null; // под зонтом кепка не нужна
    key = sky;
    if (sky === 'storm') look.mood = 'wow';
  } else if (sky === 'snow') {
    Object.assign(look, { hat: look.hat ?? 'beanie', scarf: true, boots: true });
    key = 'snow';
  } else if (sky === 'fog') {
    look.mood = 'wow';
    key = 'fog';
  }

  // Ночью — колпак и сонные глаза (кроме грозы: какой уж тут сон)
  if (night && sky !== 'storm') {
    Object.assign(look, { hat: 'nightcap', glasses: false, mood: 'sleepy' });
    key = 'night';
  }

  const phrases = [...PHRASES[key]];
  if (windy && !night) phrases.unshift(...PHRASES.windy);
  return { ...look, phrases };
}
