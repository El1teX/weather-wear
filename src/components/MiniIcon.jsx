// Маленькие мультяшные иконки погоды для почасового прогноза.
// Тот же стиль, что у большой сцены: заливка и тёмная обводка.
const OUTLINE = '#27304A';

const CLOUD = 'M9 30c-4 0-7-3-7-7s3-7 7-7c1-5 5-9 11-9 5 0 9 3 10 7 1 0 2-1 3-1 5 0 8 4 8 8 3 0 5 3 5 5s-2 4-4 4H9z';

function Sun({ cx = 22, cy = 22, r = 9 }) {
  return (
    <g>
      {Array.from({ length: 8 }, (_, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy - r - 3}
          x2={cx}
          y2={cy - r - 7}
          stroke="#FFB938"
          strokeWidth={3}
          strokeLinecap="round"
          transform={`rotate(${i * 45} ${cx} ${cy})`}
        />
      ))}
      <circle cx={cx} cy={cy} r={r} fill="#FFD84A" stroke={OUTLINE} strokeWidth={2} />
    </g>
  );
}

function Moon({ cx = 22, cy = 22, r = 13 }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#FFF1B8" stroke={OUTLINE} strokeWidth={2} />
      <path d={`M${cx - 7} ${cy - 1}q2.5 2.5 5 0M${cx + 2} ${cy - 1}q2.5 2.5 5 0`} fill="none" stroke={OUTLINE} strokeWidth={1.6} strokeLinecap="round" />
      <path d={`M${cx - 2.5} ${cy + 4.5}q2.5 2 5 0`} fill="none" stroke={OUTLINE} strokeWidth={1.6} strokeLinecap="round" />
    </g>
  );
}

function Cloud({ x = 0, y = 4, fill = '#FFFFFF', scale = 1 }) {
  return (
    <path
      d={CLOUD}
      transform={`translate(${x} ${y}) scale(${scale})`}
      fill={fill}
      stroke={OUTLINE}
      strokeWidth={2}
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
    />
  );
}

function Drops() {
  return (
    <g fill="#7CC8FF" stroke={OUTLINE} strokeWidth={1.2}>
      <path d="M14 34c1.5 2 2.5 3.5 2.5 4.6a2.5 2.5 0 0 1-5 0c0-1.1 1-2.6 2.5-4.6z" />
      <path d="M24 36c1.5 2 2.5 3.5 2.5 4.6a2.5 2.5 0 0 1-5 0c0-1.1 1-2.6 2.5-4.6z" />
      <path d="M34 34c1.5 2 2.5 3.5 2.5 4.6a2.5 2.5 0 0 1-5 0c0-1.1 1-2.6 2.5-4.6z" />
    </g>
  );
}

function Flakes() {
  return (
    <g stroke={OUTLINE} strokeWidth={1.6} strokeLinecap="round">
      {[14, 24, 34].map((x, i) => (
        <path key={x} d={`M${x} ${35 + (i % 2) * 2}v6M${x - 3} ${36.5 + (i % 2) * 2}l6 3M${x - 3} ${39.5 + (i % 2) * 2}l6 -3`} />
      ))}
    </g>
  );
}

const RAIN = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82];
const SNOW = [71, 73, 75, 77, 85, 86];
const STORM = [95, 96, 99];

export default function MiniIcon({ code, isDay, size = 40 }) {
  let body;
  if (STORM.includes(code)) {
    body = (
      <>
        <Cloud fill="#8A86C6" />
        <path d="M24 30l-5 8h4l-3 7 9-10h-4l3-5z" fill="#FFE14D" stroke={OUTLINE} strokeWidth={1.5} strokeLinejoin="round" />
      </>
    );
  } else if (RAIN.includes(code)) {
    body = (
      <>
        <Drops />
        <Cloud fill="#B8C7DD" />
      </>
    );
  } else if (SNOW.includes(code)) {
    body = (
      <>
        <Flakes />
        <Cloud />
      </>
    );
  } else if (code === 45 || code === 48) {
    body = (
      <g stroke={OUTLINE} strokeWidth={2.4} strokeLinecap="round">
        <path d="M8 16h28M5 23h34M9 30h26" />
      </g>
    );
  } else if (code === 3) {
    body = <Cloud fill="#E3EAF3" y={6} />;
  } else if (code === 1 || code === 2) {
    body = (
      <>
        {isDay ? <Sun cx={17} cy={16} r={8} /> : <Moon cx={17} cy={15} r={10} />}
        <Cloud x={6} y={12} scale={0.82} />
      </>
    );
  } else {
    body = isDay ? <Sun /> : <Moon />;
  }

  return (
    <svg viewBox="0 0 44 46" width={size} height={size} aria-hidden="true" focusable="false">
      {body}
    </svg>
  );
}
