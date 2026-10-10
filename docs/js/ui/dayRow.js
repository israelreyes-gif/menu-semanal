import { dayName, dayNumber, todayISO } from '../domain/dates.js';
import { statusDot } from './statusDot.js';

// Fila de un día de la semana. onSelect recibe la fecha.
export function renderDayRow(date, status, isSelected, onSelect) {
  const row = document.createElement('button');
  row.type = 'button';
  row.className = 'day-row';
  if (isSelected) row.classList.add('is-selected');
  if (date === todayISO()) row.classList.add('is-today');

  const num = document.createElement('span');
  num.className = 'day-num';
  num.textContent = dayNumber(date);

  const name = document.createElement('span');
  name.className = 'day-name';
  name.textContent = dayName(date);

  row.append(num, name, statusDot(status));
  row.addEventListener('click', () => onSelect(date));
  return row;
}
