import { useEffect, useRef, useState } from 'react';

const reduceMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Плавно «докручивает» число до нового значения */
export function useCountUp(target, duration = 700) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);

  useEffect(() => {
    if (!Number.isFinite(target)) return undefined;
    const from = fromRef.current;
    if (reduceMotion() || !Number.isFinite(from) || from === target) {
      fromRef.current = target;
      setValue(target);
      return undefined;
    }
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      setValue(from + (target - from) * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
      else fromRef.current = target;
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      fromRef.current = target;
    };
  }, [target, duration]);

  return value;
}
