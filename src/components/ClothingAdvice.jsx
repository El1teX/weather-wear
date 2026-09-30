import { getClothingAdvice } from '../utils/clothing';
import { iconFor } from '../utils/clothingIcons';

const signed = (n) => (n > 0 ? `+${n}` : `${n}`);

export default function ClothingAdvice({ weather }) {
  const advice = getClothingAdvice(weather);
  let order = 0;

  return (
    <section className="block" aria-labelledby="wear-title">
      <h2 id="wear-title" className="block__title">Что надеть</h2>
      <p className="block__lead">
        Ощущается как {signed(advice.feelsLike)}°: {advice.title.toLowerCase()}.
      </p>

      <div className="outfit">
        {advice.layers.map((layer) => (
          <div key={layer.key} className="outfit__row">
            <h3 className="outfit__label">{layer.label}</h3>
            <ul className="outfit__items">
              {layer.items.map((item) => (
                <li key={item} className="chip" style={{ '--i': order++ }}>
                  <span className="chip__icon" aria-hidden="true">{iconFor(item)}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {advice.notes.length > 0 && (
        <div className="notes">
          <span className="notes__icon" aria-hidden="true">💡</span>
          <ul>
            {advice.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
