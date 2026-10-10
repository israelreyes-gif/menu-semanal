import { dayNumber, isSameMonth, todayISO } from '../domain/dates.js';
import { statusDot } from './statusDot.js';

const WEEKDAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

// Cuadrícula del mes.
// config: { dates, month, selected, statusOf(date), onSelect(date) }
export function renderMonthGrid({ dates, month, selected, statusOf, onSelect }) {
  const grid = document.createElement('div');
  grid.className = 'cal-grid';

  WEEKDAYS.forEach((w) => {
    const head = document.createElement('div');
    head.className = 'cal-weekday';
    head.textContent = w;
    grid.append(head);
  });

  const today = todayISO();

  dates.forEach((date) => {
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'cal-cell';
    if (!isSameMonth(date, month)) cell.classList.add('is-outside');
    if (date === selected) cell.classList.add('is-selected');
    if (date === today) cell.classList.add('is-today');

    const num = document.createElement('span');
    num.className = 'cal-num';
    num.textContent = dayNumber(date);

    cell.append(num, statusDot(statusOf(date)));
    cell.addEventListener('click', () => onSelect(date));
    grid.append(cell);
  });

  return grid;
}
