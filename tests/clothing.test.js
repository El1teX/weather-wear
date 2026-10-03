import { describe, expect, it } from 'vitest';
import { getClothingAdvice } from '../src/utils/clothing';
import { iconFor } from '../src/utils/clothingIcons';
import { makeWeather } from './helpers';

const items = (advice, key) => advice.layers.find((l) => l.key === key).items;
const all = (advice) => advice.layers.flatMap((l) => l.items).join(' | ');

describe('советы по одежде', () => {
  it('подбирает диапазон по температуре «ощущается как»', () => {
    expect(getClothingAdvice(makeWeather({ feelsLike: -25 })).title).toBe('Сильный мороз');
    expect(getClothingAdvice(makeWeather({ feelsLike: -10 })).title).toBe('Морозно');
    expect(getClothingAdvice(makeWeather({ feelsLike: 0 })).title).toBe('Холодно');
    expect(getClothingAdvice(makeWeather({ feelsLike: 18 })).title).toBe('Комфортно');
    expect(getClothingAdvice(makeWeather({ feelsLike: 32 })).title).toBe('Жарко');
  });

  it('в дождь предлагает непромокаемую куртку, обувь и зонт', () => {
    const a = getClothingAdvice(makeWeather({ code: 63, feelsLike: 8 }));
    expect(all(a)).toMatch(/Непромокаемая куртка/);
    expect(items(a, 'shoes')[0]).toMatch(/Непромокаемая/);
    expect(items(a, 'extras')).toContain('Зонт');
  });

  it('при вероятности дождя 30–59% советует компактный зонт', () => {
    const a = getClothingAdvice(makeWeather({ today: { precipChance: 40 } }));
    expect(items(a, 'extras')).toContain('Компактный зонт на всякий случай');
  });

  it('при сильном ветре в холод шапка обязательна и не дублируется', () => {
    const a = getClothingAdvice(makeWeather({ feelsLike: 3, wind: 10, gusts: 15 }));
    const hats = items(a, 'extras').filter((i) => /шапк/i.test(i));
    expect(hats).toHaveLength(1);
    expect(hats[0]).toMatch(/обязательна/);
  });

  it('в гололёд при минусе советует утеплённую нескользящую обувь', () => {
    const a = getClothingAdvice(makeWeather({ code: 66, feelsLike: -1 }));
    expect(items(a, 'shoes')[0]).toBe('Утеплённые ботинки с нескользящей подошвой');
  });

  it('при высоком УФ-индексе добавляет очки и крем', () => {
    const a = getClothingAdvice(makeWeather({ feelsLike: 25, today: { uvMax: 8 } }));
    expect(items(a, 'extras')).toEqual(expect.arrayContaining(['Солнцезащитные очки', 'Крем с SPF 30 или выше']));
  });

  it('при большом перепаде температур советует дополнительный слой', () => {
    const a = getClothingAdvice(makeWeather({ today: { max: 24, min: 9 } }));
    expect(a.notes.join(' ')).toMatch(/дополнительн|лёгкий слой/);
  });

  it('если аксессуары не нужны, так и пишет', () => {
    const a = getClothingAdvice(makeWeather({ feelsLike: 12 }));
    expect(items(a, 'extras')).toEqual(['Ничего дополнительного не нужно']);
  });
});

describe('иконки вещей', () => {
  it('подбирает подходящий эмодзи', () => {
    expect(iconFor('Зимняя куртка')).toBe('🧥');
    expect(iconFor('Джинсы или брюки')).toBe('👖');
    expect(iconFor('Зонт')).toBe('☂️');
    expect(iconFor('Кроссовки')).toBe('👟');
    expect(iconFor('Что-то непонятное')).toBe('✨');
  });
});
