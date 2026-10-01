import { isRainy, isSnowy } from './weatherCodes';

const wet = (code) => isRainy(code) || isSnowy(code);
const clock = (iso) => iso.slice(11, 16);

/**
 * Короткая подсказка по осадкам на ближайшие 12 часов:
 * когда начнётся или закончится дождь или снег.
 */
export function precipitationHint(hours, currentCode) {
  const next = hours.slice(1, 13);
  if (!next.length) return null;

  const snowNow = isSnowy(currentCode);
  const nowWet = wet(currentCode);

  if (nowWet) {
    const stop = next.find((h) => !wet(h.code) && h.pop < 40);
    const what = snowNow ? 'Снег' : 'Дождь';
    return stop
      ? { tone: 'good', text: `${what} закончится около ${clock(stop.time)}` }
      : { tone: 'warn', text: `${what} будет идти ещё как минимум 12 часов` };
  }

  const start = next.find((h) => wet(h.code) || h.pop >= 50);
  if (start) {
    const what = isSnowy(start.code) ? 'Снег' : 'Дождь';
    return { tone: 'warn', text: `${what} начнётся около ${clock(start.time)}` };
  }
  return { tone: 'good', text: 'Ближайшие 12 часов без осадков' };
}
