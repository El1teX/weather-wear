import { describe, expect, it } from 'vitest';
import { precipitationHint } from '../src/utils/hourly';
import { makeHours } from './helpers';

describe('подсказка об осадках', () => {
  it('сообщает, когда начнётся дождь', () => {
    const hours = makeHours([[14, 0], [15, 0], [16, 0], [17, 63, 80], [18, 63, 80]]);
    expect(precipitationHint(hours, 0)).toEqual({ tone: 'warn', text: 'Дождь начнётся около 17:00' });
  });

  it('сообщает, когда дождь закончится', () => {
    const hours = makeHours([[14, 63, 90], [15, 63, 90], [16, 2, 10], [17, 2, 10]]);
    expect(precipitationHint(hours, 63)).toEqual({ tone: 'good', text: 'Дождь закончится около 16:00' });
  });

  it('называет снег снегом', () => {
    const hours = makeHours([[14, 0], [15, 73, 70]]);
    expect(precipitationHint(hours, 0).text).toBe('Снег начнётся около 15:00');
  });

  it('если осадков нет, так и пишет', () => {
    const hours = makeHours([[14, 0], [15, 1, 10], [16, 2, 15]]);
    expect(precipitationHint(hours, 0)).toEqual({ tone: 'good', text: 'Ближайшие 12 часов без осадков' });
  });

  it('высокая вероятность считается осадками даже без кода дождя', () => {
    const hours = makeHours([[14, 0], [15, 3, 60]]);
    expect(precipitationHint(hours, 0).tone).toBe('warn');
  });
});
