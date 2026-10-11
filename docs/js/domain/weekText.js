import { weekDates, addDays, dayName, dayNumber, monthName } from './dates.js';
import { MEAL_ORDER, MEAL_LABELS, mealText } from './summary.js';
import { dayStatus, STATUS } from './rules.js';

const short = (iso) => `${dayNumber(iso)} ${monthName(iso).slice(0, 3)}`;

// Texto del menú de la semana que empieza en `start`, para compartir o copiar.
export function weekText(start, days) {
  const lines = [`Menú (${short(start)} – ${short(addDays(start, 6))})`];

  weekDates(start).forEach((date) => {
    const day = days[date];
    lines.push('', `${dayName(date)} ${dayNumber(date)}`);

    if (dayStatus(day) === STATUS.NONE) {
      lines.push('Sin diseñar');
      return;
    }

    MEAL_ORDER.forEach((meal) => {
      lines.push(`- ${MEAL_LABELS[meal]}: ${mealText(meal, day[meal])}`);
    });
  });

  return lines.join('\n');
}
