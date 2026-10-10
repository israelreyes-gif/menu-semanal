import { longLabel } from '../domain/dates.js';
import { MEAL_ORDER, MEAL_LABELS, mealText } from '../domain/summary.js';

// Tarjeta con el resumen de las cuatro comidas del día seleccionado.
export function renderDayDetail(date, day) {
  const card = document.createElement('section');
  card.className = 'day-detail';

  const title = document.createElement('h3');
  title.textContent = longLabel(date);
  card.append(title);

  MEAL_ORDER.forEach((meal) => {
    const row = document.createElement('div');
    row.className = 'meal-row';

    const label = document.createElement('span');
    label.className = 'meal-label';
    label.textContent = MEAL_LABELS[meal];

    const text = document.createElement('span');
    text.className = 'meal-text';
    text.textContent = mealText(meal, day && day[meal]);

    row.append(label, text);
    card.append(row);
  });

  return card;
}
