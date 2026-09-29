import { getClothingAdvice } from '../utils/clothing';

const signed = (n) => (n > 0 ? `+${n}` : `${n}`);

export default function ClothingAdvice({ weather }) {
  const advice = getClothingAdvice(weather);

  return (
    <section className="wear" aria-labelledby="wear-title">
      <h2 id="wear-title" className="section-title">Что надеть</h2>
      <p className="wear__lead">
        Ощущается как {signed(advice.feelsLike)}° — {advice.title.toLowerCase()}.
      </p>

      <div className="wear__layers">
        {advice.layers.map((layer) => (
          <div key={layer.key} className="wear__layer">
            <h3 className="wear__label">{layer.label}</h3>
            <ul className="wear__items">
              {layer.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {advice.notes.length > 0 && (
        <ul className="wear__notes">
          {advice.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
