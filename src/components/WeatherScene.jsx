import { useMemo } from 'react';

// Мультяшная сцена неба. Объекты нарисованы в SVG с обводкой,
// анимации — на CSS (styles.css, раздел «Сцена»). При включённом
// «уменьшить движение» анимации выключаются, объекты остаются на месте.

const OUTLINE = '#27304A';

// Детерминированный генератор, чтобы капли и звёзды не прыгали при перерисовке
function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const CLOUD_PATH =
  'M14 44C5 44 0 37 0 30c0-8 7-14 15-13 2-10 11-17 22-17 10 0 18 6 21 14 3-3 8-5 13-5 12 0 21 9 21 20 8 0 14 7 14 14 0 1 0 1-1 1H14z';

function Face({ mood = 'happy', x = 0, y = 0, size = 1, cheeks = '#FF8FA3' }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size})`}>
      {mood === 'sleepy' ? (
        <g fill="none" stroke={OUTLINE} strokeWidth={2.6} strokeLinecap="round">
          <path d="M-14 -2q4 4 8 0" />
          <path d="M6 -2q4 4 8 0" />
        </g>
      ) : (
        <g className="scene-blink" fill={OUTLINE}>
          <ellipse cx={-10} cy={-3} rx={3.2} ry={4.4} />
          <ellipse cx={10} cy={-3} rx={3.2} ry={4.4} />
        </g>
      )}
      <circle cx={-17} cy={6} r={4.5} fill={cheeks} opacity={0.75} />
      <circle cx={17} cy={6} r={4.5} fill={cheeks} opacity={0.75} />
      {mood === 'wow' ? (
        <ellipse cx={0} cy={9} rx={3.5} ry={4.5} fill={OUTLINE} />
      ) : (
        <path d="M-7 6q7 8 14 0" fill="none" stroke={OUTLINE} strokeWidth={2.6} strokeLinecap="round" />
      )}
    </g>
  );
}

function Cloud({ x, y, scale = 1, fill = '#FFFFFF', face, speed = 'slow' }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g className={`scene-drift scene-drift--${speed}`}>
        <g className="scene-bob">
          <path
            d={CLOUD_PATH}
            fill={fill}
            stroke={OUTLINE}
            strokeWidth={3}
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          {face && <Face mood={face} x={56} y={28} size={0.62} />}
        </g>
      </g>
    </g>
  );
}

function Sun({ x, y, r = 30, face = 'happy' }) {
  const rays = Array.from({ length: 10 }, (_, i) => i * 36);
  return (
    <g transform={`translate(${x} ${y})`} className="scene-pop">
      <g className="scene-float">
        <circle r={r * 2} fill="url(#sun-glow)" />
        <g className="scene-spin">
          {rays.map((deg) => (
            <path
              key={deg}
              d={`M-7 ${-(r + 6)} L0 ${-(r + 24)} L7 ${-(r + 6)} Z`}
              fill="#FFB938"
              stroke={OUTLINE}
              strokeWidth={2.6}
              strokeLinejoin="round"
              transform={`rotate(${deg})`}
            />
          ))}
        </g>
        <circle r={r} fill="#FFD84A" stroke={OUTLINE} strokeWidth={3} />
        <path d={`M${-r * 0.55} ${-r * 0.45}a${r * 0.7} ${r * 0.7} 0 0 1 ${r * 0.5} ${-r * 0.3}`} fill="none" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" opacity={0.7} />
        <Face mood={face} y={4} size={r / 34} />
      </g>
    </g>
  );
}

function Moon({ x, y, r = 30 }) {
  return (
    <g transform={`translate(${x} ${y})`} className="scene-pop">
      <g className="scene-float">
        <circle r={r * 2} fill="url(#moon-glow)" />
        <circle r={r} fill="#FFF1B8" stroke={OUTLINE} strokeWidth={3} />
        <circle cx={-r * 0.45} cy={-r * 0.5} r={r * 0.14} fill="#F2DE8C" />
        <circle cx={r * 0.55} cy={-r * 0.3} r={r * 0.1} fill="#F2DE8C" />
        <Face mood="sleepy" y={r * 0.15} size={r / 36} cheeks="#FFB3A7" />
        <g className="scene-zzz" fill={OUTLINE} fontFamily="Nunito, sans-serif" fontWeight={900}>
          <text x={r * 0.9} y={-r * 0.9} fontSize={12}>z</text>
          <text x={r * 1.25} y={-r * 1.3} fontSize={16}>z</text>
        </g>
      </g>
    </g>
  );
}

const STAR_PATH = 'M0 -7L2 -2L7 -2L3 1.5L4.5 7L0 3.8L-4.5 7L-3 1.5L-7 -2L-2 -2Z';

function Stars({ rand, count = 16 }) {
  const stars = Array.from({ length: count }, () => ({
    x: 20 + rand() * 360,
    y: 14 + rand() * 150,
    s: 0.6 + rand() * 0.8,
    delay: -rand() * 3,
  }));
  return (
    <g>
      {stars.map((s, i) => (
        <g key={i} transform={`translate(${s.x} ${s.y}) scale(${s.s})`}>
          <path
            d={STAR_PATH}
            fill="#FFE38A"
            stroke={OUTLINE}
            strokeWidth={1.2}
            strokeLinejoin="round"
            className="scene-twinkle"
            style={{ animationDelay: `${s.delay}s` }}
          />
        </g>
      ))}
    </g>
  );
}

const DROP_PATH = 'M0 -8C3 -3 6 1 6 4.5A6 6 0 0 1 -6 4.5C-6 1 -3 -3 0 -8Z';

function Rain({ rand, count, heavy }) {
  const drops = Array.from({ length: count }, () => ({
    x: 200 + rand() * 150,
    y: 100 + rand() * 200,
    s: heavy ? 0.9 + rand() * 0.4 : 0.7 + rand() * 0.4,
    delay: -rand() * 1.4,
    dur: (heavy ? 0.75 : 1.05) + rand() * 0.35,
  }));
  return (
    <g>
      {drops.map((d, i) => (
        <g key={i} transform={`translate(${d.x} ${d.y}) scale(${d.s})`}>
          <g className="scene-fall" style={{ animationDelay: `${d.delay}s`, animationDuration: `${d.dur}s` }}>
            <path d={DROP_PATH} fill="#7CC8FF" stroke={OUTLINE} strokeWidth={1.6} />
          </g>
        </g>
      ))}
    </g>
  );
}

function Snow({ rand, count }) {
  const flakes = Array.from({ length: count }, () => ({
    x: 180 + rand() * 210,
    y: 90 + rand() * 210,
    s: 0.6 + rand() * 0.6,
    delay: -rand() * 9,
    dur: 6 + rand() * 5,
  }));
  return (
    <g>
      {flakes.map((f, i) => (
        <g key={i} transform={`translate(${f.x} ${f.y}) scale(${f.s})`}>
          <g className="scene-snowfall" style={{ animationDelay: `${f.delay}s`, animationDuration: `${f.dur}s` }}>
            <g className="scene-sway" style={{ animationDelay: `${f.delay}s` }}>
              <g className="scene-spin-fast">
                <g stroke={OUTLINE} strokeWidth={5} strokeLinecap="round">
                  <path d="M0 -8V8M-7 -4L7 4M-7 4L7 -4" />
                </g>
                <g stroke="#FFFFFF" strokeWidth={2.6} strokeLinecap="round">
                  <path d="M0 -8V8M-7 -4L7 4M-7 4L7 -4" />
                </g>
              </g>
            </g>
          </g>
        </g>
      ))}
    </g>
  );
}

function Lightning() {
  return (
    <g>
      <rect width={400} height={300} fill="#FFFFFF" className="scene-flash" />
      <path
        d="M300 104l-22 44h17l-13 42 38-56h-19l15-30z"
        fill="#FFE14D"
        stroke={OUTLINE}
        strokeWidth={3}
        strokeLinejoin="round"
        className="scene-bolt"
      />
    </g>
  );
}

function Fog() {
  return (
    <g fill="#FFFFFF">
      {[
        [130, 0.55, 'slow'],
        [170, 0.45, 'medium'],
        [210, 0.55, 'slow'],
        [250, 0.4, 'medium'],
      ].map(([y, o, speed], i) => (
        <g key={i} opacity={o}>
          <g className={`scene-drift scene-drift--${speed}`}>
            <rect x={-60} y={y} width={520} height={24} rx={12} />
          </g>
        </g>
      ))}
    </g>
  );
}

function Birds() {
  return (
    <g className="scene-birds" fill="none" stroke={OUTLINE} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
      <g transform="translate(0 64)">
        <path className="scene-flap" d="M0 0q6 -7 12 0q6 -7 12 0" />
      </g>
      <g transform="translate(30 50) scale(0.75)">
        <path className="scene-flap scene-flap--late" d="M0 0q6 -7 12 0q6 -7 12 0" />
      </g>
    </g>
  );
}

// Какие объекты показывать для кода погоды WMO
function layoutFor(code) {
  const rain = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82];
  const snow = [71, 73, 75, 77, 85, 86];
  const storm = [95, 96, 99];
  const heavy = [55, 57, 65, 67, 81, 82, 95, 96, 99];

  if (storm.includes(code)) return { kind: 'storm', heavy: true };
  if (rain.includes(code)) return { kind: 'rain', heavy: heavy.includes(code) };
  if (snow.includes(code)) return { kind: 'snow', heavy: [75, 86].includes(code) };
  if (code === 45 || code === 48) return { kind: 'fog' };
  if (code === 3) return { kind: 'overcast' };
  if (code === 2) return { kind: 'partly' };
  if (code === 1) return { kind: 'mostly-clear' };
  return { kind: 'clear' };
}

export default function WeatherScene({ code, isDay }) {
  const idle = code === undefined || code === null;
  const { kind, heavy } = idle ? { kind: 'idle' } : layoutFor(code);

  const content = useMemo(() => {
    const rand = seeded(7 + (code ?? 0));
    const white = '#FFFFFF';
    const grey = isDay ? '#E3EAF3' : '#B9C1E0';
    const rainy = isDay ? '#B8C7DD' : '#8E97C4';
    const skyObject = isDay ? <Sun x={322} y={70} /> : <Moon x={322} y={70} />;

    switch (kind) {
      case 'idle':
        return (
          <>
            <Birds />
            <Sun x={322} y={70} />
            <Cloud x={196} y={116} scale={0.85} face="happy" speed="slow" />
          </>
        );
      case 'clear':
        return (
          <>
            {isDay ? <Birds /> : <Stars rand={rand} />}
            {skyObject}
          </>
        );
      case 'mostly-clear':
        return (
          <>
            {isDay ? <Birds /> : <Stars rand={rand} count={12} />}
            {skyObject}
            <Cloud x={178} y={48} scale={0.72} fill={white} face="happy" speed="slow" />
          </>
        );
      case 'partly':
        return (
          <>
            {!isDay && <Stars rand={rand} count={10} />}
            {skyObject}
            <Cloud x={172} y={40} scale={0.88} fill={white} face="happy" speed="slow" />
          </>
        );
      case 'overcast':
        return (
          <>
            <Cloud x={270} y={12} scale={1} fill={grey} speed="medium" />
            <Cloud x={190} y={46} scale={1.15} fill={white} face="sleepy" speed="slow" />
          </>
        );
      case 'rain':
        return (
          <>
            <Rain rand={rand} count={heavy ? 34 : 22} heavy={heavy} />
            <Cloud x={196} y={46} scale={1.3} fill={rainy} face="wow" speed="slow" />
          </>
        );
      case 'snow':
        return (
          <>
            <Snow rand={rand} count={heavy ? 34 : 22} />
            <Cloud x={196} y={46} scale={1.3} fill={white} face="happy" speed="slow" />
          </>
        );
      case 'storm':
        return (
          <>
            <Rain rand={rand} count={30} heavy />
            <Lightning />
            <Cloud x={196} y={40} scale={1.35} fill="#8A86C6" face="wow" speed="slow" />
          </>
        );
      case 'fog':
        return (
          <>
            {isDay ? <Sun x={322} y={70} r={26} face="sleepy" /> : <Moon x={322} y={70} />}
            <Fog />
          </>
        );
      default:
        return null;
    }
  }, [kind, heavy, isDay, code]);

  return (
    <svg
      className="scene"
      viewBox="0 0 400 300"
      preserveAspectRatio="xMaxYMin slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="sun-glow">
          <stop offset="0" stopColor="#FFF3B0" stopOpacity="0.8" />
          <stop offset="1" stopColor="#FFF3B0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="moon-glow">
          <stop offset="0" stopColor="#FFF1B8" stopOpacity="0.4" />
          <stop offset="1" stopColor="#FFF1B8" stopOpacity="0" />
        </radialGradient>
      </defs>
      {content}
    </svg>
  );
}
