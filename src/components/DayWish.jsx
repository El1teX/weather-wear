import { getDayWish } from '../utils/wishes';

export default function DayWish({ weather, cityName }) {
  const { greeting, text } = getDayWish(weather, cityName);

  return (
    <section className="wish" aria-labelledby="wish-title">
      <h2 id="wish-title" className="wish__label">Пожелание на день</h2>
      <p className="wish__text">
        <span className="wish__greeting">{greeting}!</span> {text}
      </p>
    </section>
  );
}
