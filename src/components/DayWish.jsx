import { getDayWish } from '../utils/wishes';

const GREETING_EMOJI = {
  'Доброе утро': '🌅',
  'Добрый день': '👋',
  'Добрый вечер': '🌆',
  'Доброй ночи': '🌙',
};

export default function DayWish({ weather, cityName }) {
  const { greeting, text } = getDayWish(weather, cityName);

  return (
    <section className="wish" aria-label="Пожелание на день">
      <p className="wish__greeting">
        <span className="wish__emoji" aria-hidden="true">{GREETING_EMOJI[greeting]}</span>
        {greeting}!
      </p>
      <p className="wish__text">{text}</p>
    </section>
  );
}
