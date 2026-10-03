// Мультяшные животные-спутники: лиса, енот и обезьяна.
// У всех одинаковая «анатомия» (голова, тело, лапы, ноги),
// поэтому погодные аксессуары подходят каждому.

const O = '#27304A'; // обводка

export const PALETTES = {
  fox: { body: '#F28C3A', dark: '#C4621E', light: '#FFF4E8' },
  raccoon: { body: '#9AA3AD', dark: '#4A5160', light: '#EEF1F4' },
  monkey: { body: '#A0663F', dark: '#7A4A2B', light: '#F2C9A0' },
};

function Tail({ pet, c }) {
  if (pet === 'fox') {
    return (
      <g className="pet__tail">
        <path d="M40 128C14 134-2 114 6 92c8 12 20 20 36 22z" fill={c.body} stroke={O} strokeWidth={3} strokeLinejoin="round" />
        <path d="M6 92c-3 8-2 15 2 20 5-3 10-3 15-1C14 107 9 101 6 92z" fill={c.light} stroke={O} strokeWidth={2.5} strokeLinejoin="round" />
      </g>
    );
  }
  if (pet === 'raccoon') {
    return (
      <g className="pet__tail">
        <path d="M40 130C16 136 0 118 6 96c10 10 22 18 36 20z" fill={c.body} stroke={O} strokeWidth={3} strokeLinejoin="round" />
        <path d="M9 108c5 2 9 6 11 11M17 101c4 4 8 8 9 13M28 108c2 5 3 10 2 14" fill="none" stroke={c.dark} strokeWidth={5} strokeLinecap="round" />
      </g>
    );
  }
  // Обезьяна: закрученный хвост
  return (
    <g className="pet__tail" fill="none" strokeLinecap="round">
      <path d="M84 128c26 6 36-22 20-30-10-5-14 8-6 10" stroke={O} strokeWidth={10} />
      <path d="M84 128c26 6 36-22 20-30-10-5-14 8-6 10" stroke={c.body} strokeWidth={5} />
    </g>
  );
}

function Head({ pet, c }) {
  if (pet === 'fox') {
    return (
      <g>
        <path d="M30 46 34 8l24 26z" fill={c.body} stroke={O} strokeWidth={3} strokeLinejoin="round" />
        <path d="M90 46 86 8 62 34z" fill={c.body} stroke={O} strokeWidth={3} strokeLinejoin="round" />
        <path d="M36 36l1-17 11 12zM84 36l-1-17-11 12z" fill={c.dark} />
        <circle cx={60} cy={62} r={34} fill={c.body} stroke={O} strokeWidth={3} />
        <path d="M27 64c7 26 59 26 66 0-10 8-22 6-33 18-11-12-23-10-33-18z" fill={c.light} />
        <ellipse cx={60} cy={78} rx={4.5} ry={3.5} fill={O} />
      </g>
    );
  }
  if (pet === 'raccoon') {
    return (
      <g>
        <circle cx={32} cy={34} r={11} fill={c.body} stroke={O} strokeWidth={3} />
        <circle cx={88} cy={34} r={11} fill={c.body} stroke={O} strokeWidth={3} />
        <circle cx={32} cy={34} r={5} fill={c.dark} />
        <circle cx={88} cy={34} r={5} fill={c.dark} />
        <circle cx={60} cy={62} r={34} fill={c.body} stroke={O} strokeWidth={3} />
        <path d="M28 60c6-12 24-9 32-1 8-8 26-11 32 1-4 12-22 11-32 6-10 5-28 6-32-6z" fill={c.dark} />
        <ellipse cx={60} cy={79} rx={15} ry={10} fill={c.light} />
        <ellipse cx={60} cy={74} rx={4.5} ry={3.5} fill={O} />
      </g>
    );
  }
  // Обезьяна
  return (
    <g>
      <circle cx={25} cy={62} r={11} fill={c.body} stroke={O} strokeWidth={3} />
      <circle cx={95} cy={62} r={11} fill={c.body} stroke={O} strokeWidth={3} />
      <circle cx={25} cy={62} r={6} fill={c.light} />
      <circle cx={95} cy={62} r={6} fill={c.light} />
      <circle cx={60} cy={62} r={34} fill={c.body} stroke={O} strokeWidth={3} />
      <g fill={c.light}>
        <circle cx={49} cy={60} r={13} />
        <circle cx={71} cy={60} r={13} />
        <ellipse cx={60} cy={78} rx={21} ry={13} />
      </g>
      <circle cx={57} cy={74} r={1.8} fill={O} />
      <circle cx={63} cy={74} r={1.8} fill={O} />
    </g>
  );
}

function Eyes({ mood, onDark }) {
  if (mood === 'sleepy') {
    return (
      <g fill="none" stroke={onDark ? '#FFFFFF' : O} strokeWidth={3} strokeLinecap="round">
        <path d="M42 62q6 5 12 0" />
        <path d="M66 62q6 5 12 0" />
      </g>
    );
  }
  return (
    <g className="pet__blink">
      {onDark && (
        <>
          <circle cx={48} cy={61} r={7} fill="#FFFFFF" />
          <circle cx={72} cy={61} r={7} fill="#FFFFFF" />
        </>
      )}
      <ellipse cx={48} cy={61} rx={4.5} ry={6} fill={O} />
      <ellipse cx={72} cy={61} rx={4.5} ry={6} fill={O} />
      <circle cx={49.5} cy={58.5} r={1.7} fill="#FFFFFF" />
      <circle cx={73.5} cy={58.5} r={1.7} fill="#FFFFFF" />
    </g>
  );
}

function Mouth({ mood, y }) {
  switch (mood) {
    case 'wow':
      return <ellipse cx={60} cy={y + 2} rx={4} ry={5} fill={O} />;
    case 'cold':
      return <path d={`M52 ${y}q2-3 4 0t4 0t4 0t4 0`} fill="none" stroke={O} strokeWidth={2.6} strokeLinecap="round" />;
    case 'hot':
      return (
        <g>
          <path d={`M51 ${y - 2}q9 12 18 0z`} fill={O} stroke={O} strokeWidth={2} strokeLinejoin="round" />
          <path d={`M56 ${y + 3}q4 3 8 0`} fill="#FF7A8A" />
        </g>
      );
    case 'sleepy':
      return <ellipse cx={60} cy={y} rx={3} ry={2} fill={O} />;
    default:
      return <path d={`M52 ${y - 2}q8 8 16 0`} fill="none" stroke={O} strokeWidth={2.8} strokeLinecap="round" />;
  }
}

function Hat({ type }) {
  switch (type) {
    case 'pompom':
    case 'beanie':
      return (
        <g>
          <path d="M28 50C30 18 90 18 92 50Z" fill={type === 'pompom' ? '#FF5D6C' : '#5B8DEF'} stroke={O} strokeWidth={3} strokeLinejoin="round" />
          <rect x={24} y={43} width={72} height={12} rx={6} fill="#FFFFFF" stroke={O} strokeWidth={3} />
          {type === 'pompom' && <circle cx={60} cy={17} r={8} fill="#FFFFFF" stroke={O} strokeWidth={3} />}
        </g>
      );
    case 'cap':
      return (
        <g>
          <path d="M28 48C30 22 90 22 92 48Z" fill="#2FC79A" stroke={O} strokeWidth={3} strokeLinejoin="round" />
          <path d="M60 44h40c4 0 4 6 0 7H60z" fill="#22A884" stroke={O} strokeWidth={3} strokeLinejoin="round" />
          <circle cx={60} cy={28} r={3} fill={O} />
        </g>
      );
    case 'nightcap':
      return (
        <g className="pet__sway">
          <path d="M26 50C32 26 70 6 104 26c6 4 6 12 2 18C92 34 70 32 96 50Z" fill="#6C6FB5" stroke={O} strokeWidth={3} strokeLinejoin="round" />
          <rect x={24} y={44} width={72} height={11} rx={5.5} fill="#FFFFFF" stroke={O} strokeWidth={3} />
          <circle cx={106} cy={48} r={7} fill="#FFE38A" stroke={O} strokeWidth={3} />
        </g>
      );
    default:
      return null;
  }
}

function Umbrella() {
  return (
    <g className="pet__umbrella">
      <path d="M92 110V18" stroke={O} strokeWidth={3.5} strokeLinecap="round" />
      <path d="M92 110q0 7-6 7" fill="none" stroke={O} strokeWidth={3.5} strokeLinecap="round" />
      <path
        d="M56 22C58-8 126-8 128 22c-6-6-12-6-18 0-6-6-12-6-18 0-6-6-12-6-18 0-6-6-12-6-18 0Z"
        fill="#4D9DFF"
        stroke={O}
        strokeWidth={3}
        strokeLinejoin="round"
      />
      <path d="M92-2v-5" stroke={O} strokeWidth={3} strokeLinecap="round" />
    </g>
  );
}

/** Полный рисунок животного в наряде по погоде */
export default function PetArt({ pet, look, className }) {
  const c = PALETTES[pet] ?? PALETTES.fox;
  const { hat, scarf, mittens, umbrella, boots, glasses, mood } = look;
  const paw = mittens ? '#FF5D6C' : c.body;
  const mouthY = pet === 'fox' ? 85 : 84;

  return (
    <svg viewBox="-6 -10 146 162" className={className} aria-hidden="true" focusable="false">
      <ellipse cx={60} cy={147} rx={30} ry={4.5} fill="#000" opacity={0.15} />
      <Tail pet={pet} c={c} />

      {/* Ноги или сапоги */}
      {boots ? (
        <g fill="#FFC93D" stroke={O} strokeWidth={3} strokeLinejoin="round">
          <path className="pet__foot pet__foot--l" d="M38 128h18v16H34c-2 0-3-6 4-6z" />
          <path className="pet__foot pet__foot--r" d="M64 128h18v10c7 0 6 6 4 6H64z" />
        </g>
      ) : (
        <g fill={c.dark} stroke={O} strokeWidth={3}>
          <ellipse className="pet__foot pet__foot--l" cx={47} cy={140} rx={11} ry={6.5} />
          <ellipse className="pet__foot pet__foot--r" cx={73} cy={140} rx={11} ry={6.5} />
        </g>
      )}

      <g className="pet__breathe">
        <ellipse cx={33} cy={112} rx={7} ry={12} transform="rotate(22 33 112)" fill={paw} stroke={O} strokeWidth={3} />
        <ellipse cx={60} cy={114} rx={27} ry={24} fill={c.body} stroke={O} strokeWidth={3} />
        <ellipse cx={60} cy={120} rx={16} ry={14} fill={c.light} />

        {scarf && (
          <g stroke={O} strokeWidth={3} strokeLinejoin="round">
            <path d="M68 94h11v24H68z" fill="#FF5D6C" />
            <path d="M68 108h11M68 113h11" stroke="#FFFFFF" strokeWidth={2.5} />
          </g>
        )}

        <Head pet={pet} c={c} />
        {scarf && <rect x={34} y={88} width={52} height={11} rx={5.5} fill="#FF5D6C" stroke={O} strokeWidth={3} />}

        <circle cx={37} cy={73} r={5.5} fill="#FF7A8A" opacity={0.55} />
        <circle cx={83} cy={73} r={5.5} fill="#FF7A8A" opacity={0.55} />
        <Eyes mood={mood} onDark={pet === 'raccoon'} />
        <Mouth mood={mood} y={mouthY} />

        {glasses && (
          <g>
            <rect x={37} y={54} width={22} height={14} rx={6} fill={O} />
            <rect x={61} y={54} width={22} height={14} rx={6} fill={O} />
            <path d="M41 58h6" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" opacity={0.8} />
          </g>
        )}
        {mood === 'hot' && (
          <path className="pet__sweat" d="M96 40c3 4 5 7 5 9a5 5 0 0 1-10 0c0-2 2-5 5-9z" fill="#7CC8FF" stroke={O} strokeWidth={2} />
        )}
        <Hat type={hat} />

        {umbrella ? (
          <ellipse cx={91} cy={110} rx={7} ry={11} fill={paw} stroke={O} strokeWidth={3} />
        ) : (
          <g className="pet__wave">
            <ellipse cx={87} cy={112} rx={7} ry={12} transform="rotate(-22 87 112)" fill={paw} stroke={O} strokeWidth={3} />
          </g>
        )}
      </g>
      {umbrella && <Umbrella />}
    </svg>
  );
}
