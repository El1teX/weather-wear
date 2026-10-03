import { describe, expect, it } from 'vitest';
import { DEFAULT_PET, PETS, getMascotLook, isPet } from '../src/utils/mascot';
import { makeWeather } from './helpers';

describe('выбор животного', () => {
  it('есть ровно три животных: лиса, енот, обезьяна', () => {
    expect(PETS.map((p) => p.id)).toEqual(['fox', 'raccoon', 'monkey']);
    expect(isPet(DEFAULT_PET)).toBe(true);
  });

  it('отклоняет неизвестные значения из хранилища', () => {
    expect(isPet('dragon')).toBe(false);
    expect(isPet(null)).toBe(false);
  });
});

describe('наряд спутника', () => {
  it('в сильный мороз — шапка с помпоном, шарф и варежки', () => {
    expect(getMascotLook(makeWeather({ feelsLike: -15 }))).toMatchObject({ hat: 'pompom', scarf: true, mittens: true, mood: 'cold' });
  });

  it('в дождь — зонт и сапоги, без кепки и очков', () => {
    const look = getMascotLook(makeWeather({ code: 63, feelsLike: 24 }));
    expect(look).toMatchObject({ umbrella: true, boots: true, glasses: false });
    expect(look.hat).toBeNull();
  });

  it('в жару днём — кепка и очки', () => {
    expect(getMascotLook(makeWeather({ feelsLike: 30 }))).toMatchObject({ hat: 'cap', glasses: true, mood: 'hot' });
  });

  it('ночью — колпак и сонный вид', () => {
    expect(getMascotLook(makeWeather({ time: '2026-09-30T23:30', isDay: false }))).toMatchObject({ hat: 'nightcap', mood: 'sleepy' });
  });

  it('в грозу ночью не спит', () => {
    expect(getMascotLook(makeWeather({ code: 95, time: '2026-09-30T01:00', isDay: false })).mood).toBe('wow');
  });

  it('без погоды — обычный вид без аксессуаров', () => {
    expect(getMascotLook(null)).toMatchObject({ hat: null, umbrella: false, mood: 'happy' });
  });
});
