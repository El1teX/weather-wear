import { describe, expect, it } from 'vitest';
import { getDayWish } from '../src/utils/wishes';
import { makeWeather } from './helpers';

describe('пожелания на день', () => {
  it('приветствие зависит от местного времени', () => {
    expect(getDayWish(makeWeather({ time: '2026-09-30T08:00' })).greeting).toBe('Доброе утро');
    expect(getDayWish(makeWeather({ time: '2026-09-30T13:00' })).greeting).toBe('Добрый день');
    expect(getDayWish(makeWeather({ time: '2026-09-30T19:00' })).greeting).toBe('Добрый вечер');
    expect(getDayWish(makeWeather({ time: '2026-09-30T02:00' })).greeting).toBe('Доброй ночи');
  });

  it('днём в дождь вспоминает про зонт или непогоду', () => {
    const { text } = getDayWish(makeWeather({ code: 63 }), 'Рига');
    expect(text).toMatch(/зонт|дожд|сух|чая/i);
  });

  it('ночью в дождь добавляет погодную приписку', () => {
    const { text } = getDayWish(makeWeather({ code: 63, time: '2026-09-30T01:00' }));
    expect(text).toMatch(/дождя/);
  });

  it('не меняется при повторном вызове в тот же день', () => {
    const w = makeWeather({ code: 2 });
    expect(getDayWish(w, 'Рига').text).toBe(getDayWish({ ...w, time: '2026-09-30T15:30' }, 'Рига').text);
  });

  it('в жару советует воду и тень', () => {
    expect(getDayWish(makeWeather({ feelsLike: 31 })).text).toMatch(/вод|тен/i);
  });
});
