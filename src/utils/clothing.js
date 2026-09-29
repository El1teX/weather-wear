import { describeWeather, isRainy, isSnowy } from './weatherCodes';

// Базовый комплект по температуре «ощущается как».
// Верхняя граница диапазона включительно.
const BANDS = [
  {
    upTo: -20,
    title: 'Сильный мороз',
    top: ['Термобельё', 'Тёплый свитер или флиска', 'Пуховик ниже бёдер'],
    bottom: ['Утеплённые брюки поверх термобелья'],
    shoes: ['Зимние ботинки на меху', 'Шерстяные носки'],
    extras: ['Тёплая шапка, закрывающая уши', 'Шарф или снуд', 'Варежки'],
  },
  {
    upTo: -10,
    title: 'Морозно',
    top: ['Термобельё', 'Свитер', 'Зимняя куртка или пуховик'],
    bottom: ['Утеплённые брюки или джинсы с термобельём'],
    shoes: ['Зимние ботинки', 'Тёплые носки'],
    extras: ['Тёплая шапка', 'Шарф', 'Перчатки или варежки'],
  },
  {
    upTo: 0,
    title: 'Холодно',
    top: ['Свитер или тёплая толстовка', 'Зимняя куртка'],
    bottom: ['Джинсы или плотные брюки'],
    shoes: ['Утеплённые ботинки'],
    extras: ['Шапка', 'Шарф', 'Перчатки'],
  },
  {
    upTo: 8,
    title: 'Прохладно',
    top: ['Лонгслив или тонкий свитер', 'Демисезонная куртка или пальто'],
    bottom: ['Джинсы или брюки'],
    shoes: ['Ботинки или закрытые кроссовки'],
    extras: ['Лёгкая шапка', 'Шарф по желанию'],
  },
  {
    upTo: 15,
    title: 'Свежо',
    top: ['Футболка', 'Худи или кардиган', 'Лёгкая куртка или ветровка'],
    bottom: ['Джинсы или брюки'],
    shoes: ['Кроссовки'],
    extras: [],
  },
  {
    upTo: 22,
    title: 'Комфортно',
    top: ['Футболка или рубашка', 'Лёгкий кардиган на вечер'],
    bottom: ['Лёгкие брюки, джинсы или юбка'],
    shoes: ['Кроссовки или кеды'],
    extras: [],
  },
  {
    upTo: 28,
    title: 'Тепло',
    top: ['Лёгкая футболка из хлопка или льна'],
    bottom: ['Шорты, лёгкие брюки или юбка'],
    shoes: ['Сандалии или лёгкие кеды'],
    extras: ['Кепка или панама', 'Бутылка воды'],
  },
  {
    upTo: Infinity,
    title: 'Жарко',
    top: ['Свободная светлая одежда из натуральных тканей'],
    bottom: ['Шорты или лёгкая юбка'],
    shoes: ['Открытая обувь'],
    extras: ['Головной убор обязательно', 'Бутылка воды'],
  },
];

const FREEZING_CODES = new Set([56, 57, 66, 67]);

const OUTERWEAR = /куртк|пуховик|пальто|ветровк/i;

function replaceOuter(list, text) {
  const i = list.findIndex((item) => OUTERWEAR.test(item));
  if (i >= 0) list[i] = text;
  else list.push(text);
}

function addOnce(list, item) {
  if (!list.includes(item)) list.push(item);
}

/**
 * Совет по одежде для текущей погоды.
 * @returns {{ title, feelsLike, layers: Array<{key, label, items}>, notes: string[] }}
 */
export function getClothingAdvice(weather) {
  const t = Math.round(weather.feelsLike);
  const band = BANDS.find((b) => t <= b.upTo);
  const top = [...band.top];
  const bottom = [...band.bottom];
  const shoes = [...band.shoes];
  const extras = [...band.extras];
  const notes = [];

  const { code, wind, gusts, isDay, today } = weather;
  const rainingNow = isRainy(code);
  const snowingNow = isSnowy(code);
  const chance = today.precipChance ?? 0;

  // Осадки
  if (rainingNow || (chance >= 60 && t > 0)) {
    replaceOuter(top, t <= 0 ? 'Зимняя куртка с непромокаемым верхом' : 'Непромокаемая куртка или дождевик с капюшоном');
    shoes[0] = t <= 0 ? 'Непромокаемые утеплённые ботинки' : 'Непромокаемая обувь';
    addOnce(extras, 'Зонт');
    notes.push(rainingNow ? `Сейчас: ${describeWeather(code).text.toLowerCase()}.` : `Вероятность дождя сегодня ${chance}%.`);
  } else if (chance >= 30) {
    addOnce(extras, 'Компактный зонт на всякий случай');
    notes.push(`Осадки возможны: вероятность ${chance}%.`);
  }

  if (snowingNow) {
    shoes[0] = t > 0 ? 'Непромокаемые ботинки' : 'Зимние ботинки с нескользящей подошвой';
    notes.push('Идёт снег, на тротуарах может быть скользко.');
  }

  if (FREEZING_CODES.has(code)) {
    shoes[0] = t <= 0 ? 'Утеплённые ботинки с нескользящей подошвой' : 'Обувь с нескользящей подошвой';
    notes.push('Ледяные осадки: возможен гололёд, двигайтесь осторожно.');
  }

  // Ветер
  const strongWind = wind >= 8 || gusts >= 12;
  if (strongWind) {
    if (t > 15) {
      addOnce(top, 'Ветровка на случай порывов');
    } else {
      const i = top.findIndex((item) => OUTERWEAR.test(item));
      if (i < 0) top.push('Ветрозащитная куртка');
      else if (!/капюшон/i.test(top[i])) top[i] += ', лучше с капюшоном';
    }
    if (t <= 8) {
      const hat = 'Шапка обязательна: ветер сильно охлаждает';
      const i = extras.findIndex((item) => /шапк/i.test(item));
      if (i >= 0) extras[i] = hat;
      else extras.unshift(hat);
    }
    notes.push(`Сильный ветер: ${Math.round(wind)} м/с, порывы до ${Math.round(gusts)} м/с.`);
  }

  // Солнце
  const uv = today.uvMax ?? 0;
  if (uv >= 6 && (isDay || t > 15)) {
    addOnce(extras, 'Солнцезащитные очки');
    addOnce(extras, 'Крем с SPF 30 или выше');
    notes.push(`Высокий УФ-индекс (${Math.round(uv)}): в полдень лучше держаться в тени.`);
  } else if (uv >= 3 && t > 10) {
    addOnce(extras, 'Солнцезащитные очки');
  }

  // Перепад температур
  const spread = today.max - today.min;
  if (spread >= 10) {
    const sign = (n) => (Math.round(n) > 0 ? `+${Math.round(n)}` : `${Math.round(n)}`);
    notes.push(`За день температура меняется от ${sign(today.min)}° до ${sign(today.max)}°: возьмите лёгкий слой, который легко снять или надеть.`);
  }

  return {
    title: band.title,
    feelsLike: t,
    layers: [
      { key: 'top', label: 'Верх', items: top },
      { key: 'bottom', label: 'Низ', items: bottom },
      { key: 'shoes', label: 'Обувь', items: shoes },
      { key: 'extras', label: 'Аксессуары', items: extras.length ? extras : ['Ничего дополнительного не нужно'] },
    ],
    notes,
  };
}
