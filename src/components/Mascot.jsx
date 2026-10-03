import { useMemo, useRef, useState } from 'react';
import PetArt from './PetArt';
import { PETS, getMascotLook } from '../utils/mascot';
import { haptic } from '../telegram';

// Спутник на краю шторки. Одевается по погоде.
// При нажатии по очереди то убегает и возвращается, то прыгает.

const ACTIONS = ['run', 'jump'];

export default function Mascot({ weather, pet }) {
  const look = useMemo(() => getMascotLook(weather), [weather]);
  const [action, setAction] = useState({ name: 'enter', n: 0 });
  const nextRef = useRef(0);
  const name = PETS.find((p) => p.id === pet)?.name ?? 'Спутник';

  function onTap() {
    haptic.tap();
    const next = ACTIONS[nextRef.current % ACTIONS.length];
    nextRef.current += 1;
    setAction((a) => ({ name: next, n: a.n + 1 }));
  }

  return (
    <div className={`mascot${look.mood === 'cold' ? ' mascot--shiver' : ''}`} data-pet={pet}>
      <button
        type="button"
        className="mascot__btn"
        onClick={onTap}
        aria-label={`${name}: нажмите, чтобы побегать или попрыгать`}
      >
        <span
          key={`${pet}-${action.n}`}
          className={`mascot__move is-${action.name}`}
          onAnimationEnd={(e) => {
            if (e.target === e.currentTarget) setAction((a) => ({ ...a, name: 'idle' }));
          }}
        >
          <PetArt pet={pet} look={look} className="mascot__svg" />
        </span>
      </button>
    </div>
  );
}
