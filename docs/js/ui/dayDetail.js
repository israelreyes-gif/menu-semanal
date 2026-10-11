import { longLabel } from '../domain/dates.js';
import { MEAL_ORDER, MEAL_LABELS, mealText } from '../domain/summary.js';
import { renderDayActions } from './dayActions.js';

// Tarjeta con el resumen de las cuatro comidas del día seleccionado.
// onEdit y onFill se llaman con la fecha al pulsar los botones.
export function renderDayDetail(date, day, onEdit, onFill) {
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

  card.append(renderDayActions(date, day, onEdit, onFill));
  return card;
}
