import PetArt from './PetArt';
import { PETS } from '../utils/mascot';
import { haptic } from '../telegram';

const PREVIEW_LOOK = { hat: null, scarf: false, mittens: false, umbrella: false, boots: false, glasses: false, mood: 'happy' };

/** Выбор животного-спутника */
export default function PetPicker({ pet, onChange }) {
  return (
    <section className="block" aria-labelledby="pet-title">
      <h2 id="pet-title" className="block__title">
        <span aria-hidden="true">🐾</span> Твой спутник
      </h2>
      <p className="block__lead">Нажми на спутника на небе — он побегает или попрыгает.</p>
      <div className="pets" role="radiogroup" aria-labelledby="pet-title">
        {PETS.map((p) => {
          const selected = p.id === pet;
          return (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`pet-card${selected ? ' is-selected' : ''}`}
              onClick={() => {
                if (!selected) {
                  haptic.select();
                  onChange(p.id);
                }
              }}
            >
              <PetArt pet={p.id} look={PREVIEW_LOOK} className="pet-card__art" />
              <span className="pet-card__name">{p.name}</span>
              {selected && <span className="pet-card__check" aria-hidden="true">✓</span>}
            </button>
          );
        })}
      </div>
    </section>
  );
}
