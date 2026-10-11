import { longLabel } from '../domain/dates.js';
import { MEAL_ORDER, MEAL_LABELS, mealText } from '../domain/summary.js';
import { dayStatus, STATUS } from '../domain/rules.js';
import { icon } from './icons.js';

// Tarjeta con el resumen de las cuatro comidas del día seleccionado.
// onEdit se llama al pulsar el botón de diseñar o editar.
export function renderDayDetail(date, day, onEdit) {
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

  const label = dayStatus(day) === STATUS.NONE ? 'Diseñar este día' : 'Editar día';
  const edit = document.createElement('button');
  edit.type = 'button';
  edit.className = 'edit-btn';
  edit.innerHTML = `${icon('pencil')}<span>${label}</span>`;
  edit.addEventListener('click', () => onEdit(date));
  card.append(edit);

  return card;
}
