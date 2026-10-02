import { useEffect, useMemo, useRef, useState } from 'react';
import { getMascotLook } from '../utils/mascot';
import { haptic } from '../telegram';

// Пончик — талисман приложения. Одевается по погоде и говорит фразы при нажатии.

const O = '#27304A'; // обводка
const BODY = '#FFA26B';
const BELLY = '#FFD0AE';

function Eyes({ mood }) {
  if (mood === 'sleepy') {
    return (
      <g fill="none" stroke={O} strokeWidth={3} strokeLinecap="round">
        <path d="M40 72q6 5 12 0" />
        <path d="M68 72q6 5 12 0" />
      </g>
    );
  }
  return (
    <g className="mascot__blink">
      <ellipse cx={46} cy={70} rx={5.5} ry={7.5} fill={O} />
      <ellipse cx={74} cy={70} rx={5.5} ry={7.5} fill={O} />
      <circle cx={48} cy={67} r={2} fill="#FFF" />
      <circle cx={76} cy={67} r={2} fill="#FFF" />
    </g>
  );
}

function Mouth({ mood }) {
  switch (mood) {
    case 'wow':
      return <ellipse cx={60} cy={88} rx={5} ry={6.5} fill={O} />;
    case 'cold':
      return <path d="M50 88q3 -3 5 0t5 0t5 0t5 0" fill="none" stroke={O} strokeWidth={3} strokeLinecap="round" />;
    case 'hot':
      return (
        <g>
          <path d="M48 84q12 14 24 0z" fill={O} stroke={O} strokeWidth={2.5} strokeLinejoin="round" />
          <path d="M55 90q5 4 10 0" fill="#FF7A8A" />
        </g>
      );
    case 'sleepy':
      return <ellipse cx={60} cy={88} rx={3.5} ry={2.5} fill={O} />;
    default:
      return <path d="M50 84q10 10 20 0" fill="none" stroke={O} strokeWidth={3} strokeLinecap="round" />;
  }
}

function Hat({ type }) {
  switch (type) {
    case 'pompom':
    case 'beanie':
      return (
        <g>
          <path d="M26 52C28 26 92 26 94 52Z" fill={type === 'pompom' ? '#FF5D6C' : '#5B8DEF'} stroke={O} strokeWidth={3} strokeLinejoin="round" />
          <rect x={22} y={47} width={76} height={13} rx={6.5} fill="#FFFFFF" stroke={O} strokeWidth={3} />
          {type === 'pompom' && <circle cx={60} cy={24} r={9} fill="#FFFFFF" stroke={O} strokeWidth={3} />}
        </g>
      );
    case 'cap':
      return (
        <g>
          <path d="M60 56h44c4 0 4 6 0 7H60z" fill="#22A884" stroke={O} strokeWidth={3} strokeLinejoin="round" />
          <path d="M26 54C28 28 92 28 94 54Z" fill="#2FC79A" stroke={O} strokeWidth={3} strokeLinejoin="round" />
          <circle cx={60} cy={34} r={3} fill={O} />
        </g>
      );
    case 'nightcap':
      return (
        <g className="mascot__sway">
          <path d="M24 54C30 30 70 10 104 30c6 4 6 12 2 18C92 38 70 36 96 54Z" fill="#6C6FB5" stroke={O} strokeWidth={3} strokeLinejoin="round" />
          <rect x={22} y={48} width={76} height={11} rx={5.5} fill="#FFFFFF" stroke={O} strokeWidth={3} />
          <circle cx={106} cy={52} r={7} fill="#FFE38A" stroke={O} strokeWidth={3} />
        </g>
      );
    default:
      return null;
  }
}

function Umbrella() {
  return (
    <g className="mascot__umbrella">
      <path d="M100 104V30" stroke={O} strokeWidth={3.5} strokeLinecap="round" />
      <path d="M100 104q0 8 -7 8" fill="none" stroke={O} strokeWidth={3.5} strokeLinecap="round" />
      <path
        d="M62 34C64 2 136 2 138 34c-6 -6 -13 -6 -19 0c-6 -6 -13 -6 -19 0c-6 -6 -13 -6 -19 0c-6 -6 -13 -6 -19 0Z"
        fill="#4D9DFF"
        stroke={O}
        strokeWidth={3}
        strokeLinejoin="round"
      />
      <path d="M100 10v-6" stroke={O} strokeWidth={3} strokeLinecap="round" />
    </g>
  );
}

function MascotSvg({ look }) {
  const { hat, scarf, mittens, umbrella, boots, glasses, mood } = look;
  const mitten = mittens ? '#FF5D6C' : BODY;

  return (
    <svg viewBox="-4 -4 148 150" className="mascot__svg" aria-hidden="true" focusable="false">
      <ellipse cx={60} cy={138} rx={34} ry={5} fill="#000" opacity={0.15} />
      {/* Ножки или сапоги */}
      {boots ? (
        <g fill="#FFC93D" stroke={O} strokeWidth={3} strokeLinejoin="round">
          <path d="M34 118h22v16H30c-2 0-3-6 4-6z" />
          <path d="M64 118h22v10c7 0 6 6 4 6H64z" />
        </g>
      ) : (
        <g fill="#FF8A50" stroke={O} strokeWidth={3}>
          <ellipse cx={46} cy={130} rx={12} ry={7} />
          <ellipse cx={74} cy={130} rx={12} ry={7} />
        </g>
      )}

      <g className="mascot__breathe">
        {/* Левая ручка */}
        <ellipse cx={20} cy={92} rx={8} ry={13} transform="rotate(28 20 92)" fill={mitten} stroke={O} strokeWidth={3} />
        {/* Тело */}
        <ellipse cx={60} cy={80} rx={42} ry={46} fill={BODY} stroke={O} strokeWidth={3} />
        <ellipse cx={60} cy={98} rx={24} ry={21} fill={BELLY} />
        {/* Шарф */}
        {scarf && (
          <g stroke={O} strokeWidth={3} strokeLinejoin="round">
            <rect x={26} y={98} width={68} height={13} rx={6.5} fill="#FF5D6C" />
            <path d="M74 104h12v26h-12z" fill="#FF5D6C" />
            <path d="M74 120h12M74 126h12" stroke="#FFFFFF" strokeWidth={2.5} />
          </g>
        )}
        {/* Лицо */}
        <circle cx={34} cy={84} r={6} fill="#FF7A8A" opacity={0.6} />
        <circle cx={86} cy={84} r={6} fill="#FF7A8A" opacity={0.6} />
        <Eyes mood={mood} />
        <Mouth mood={mood} />
        {glasses && (
          <g>
            <rect x={36} y={62} width={20} height={14} rx={6} fill={O} />
            <rect x={64} y={62} width={20} height={14} rx={6} fill={O} />
            <path d="M56 68h8" stroke={O} strokeWidth={3} />
            <path d="M40 66l6 0" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" opacity={0.8} />
          </g>
        )}
        {mood === 'hot' && (
          <path className="mascot__sweat" d="M96 50c3 4 5 7 5 9a5 5 0 0 1-10 0c0-2 2-5 5-9z" fill="#7CC8FF" stroke={O} strokeWidth={2} />
        )}
        <Hat type={hat} />
        {/* Правая ручка: держит зонт или машет */}
        {umbrella ? (
          <ellipse cx={98} cy={100} rx={8} ry={12} fill={mitten} stroke={O} strokeWidth={3} />
        ) : (
          <g className="mascot__wave">
            <ellipse cx={100} cy={90} rx={8} ry={13} transform="rotate(-28 100 90)" fill={mitten} stroke={O} strokeWidth={3} />
          </g>
        )}
      </g>
      {umbrella && <Umbrella />}
    </svg>
  );
}

export default function Mascot({ weather }) {
  const look = useMemo(() => getMascotLook(weather), [weather]);
  const [phrase, setPhrase] = useState(null);
  const [jump, setJump] = useState(0);
  const indexRef = useRef(0);
  const timerRef = useRef(null);

  const say = (text) => {
    clearTimeout(timerRef.current);
    setPhrase(text);
    timerRef.current = setTimeout(() => setPhrase(null), 3200);
  };

  // Здоровается при появлении и при смене погоды
  useEffect(() => {
    indexRef.current = 0;
    const t = setTimeout(() => say(look.phrases[0]), 1200);
    return () => clearTimeout(t);
  }, [look]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  function onTap() {
    haptic.tap();
    indexRef.current = (indexRef.current + 1) % look.phrases.length;
    say(look.phrases[indexRef.current]);
    setJump((n) => n + 1);
  }

  return (
    <div className={`mascot${look.mood === 'cold' ? ' mascot--shiver' : ''}`}>
      <p className={`mascot__bubble${phrase ? ' is-visible' : ''}`} role="status" aria-live="polite">
        {phrase}
      </p>
      <button
        type="button"
        className="mascot__btn"
        onClick={onTap}
        aria-label="Пончик: нажми, чтобы он что-нибудь сказал"
      >
        <span key={jump} className={jump ? 'mascot__jump' : 'mascot__enter'}>
          <MascotSvg look={look} />
        </span>
      </button>
    </div>
  );
}
