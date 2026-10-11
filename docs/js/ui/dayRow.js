import { dayName, dayNumber, todayISO } from '../domain/dates.js';
import { statusDot } from './statusDot.js';

// Casilla de un día de la semana (abreviatura, número y punto de estado).
// onSelect recibe la fecha.
export function renderDayRow(date, status, isSelected, onSelect) {
  const row = document.createElement('button');
  row.type = 'button';
  row.className = 'day-row';
  if (isSelected) row.classList.add('is-selected');
  if (date === todayISO()) row.classList.add('is-today');
  row.setAttribute('aria-label', `${dayName(date)} ${dayNumber(date)}`);

  const name = document.createElement('span');
  name.className = 'day-name';
  name.textContent = dayName(date).slice(0, 3);

  const num = document.createElement('span');
  num.className = 'day-num';
  num.textContent = dayNumber(date);

  row.append(name, num, statusDot(status));
  row.addEventListener('click', () => onSelect(date));
  return row;
}
