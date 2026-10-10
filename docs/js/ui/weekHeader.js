import { addDays, dayNumber, monthName } from '../domain/dates.js';

const shortDate = (iso) => `${dayNumber(iso)} ${monthName(iso).slice(0, 3)}`;

// Cabecera con el rango de la semana y las flechas.
// handlers: { onPrev, onNext, onToday }
export function renderWeekHeader(start, handlers) {
  const bar = document.createElement('div');
  bar.className = 'week-header';

  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'week-arrow';
  prev.textContent = '‹';
  prev.setAttribute('aria-label', 'Semana anterior');
  prev.addEventListener('click', handlers.onPrev);

  const label = document.createElement('div');
  label.className = 'week-label';
  label.textContent = `${shortDate(start)} – ${shortDate(addDays(start, 6))}`;

  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'week-arrow';
  next.textContent = '›';
  next.setAttribute('aria-label', 'Semana siguiente');
  next.addEventListener('click', handlers.onNext);

  const today = document.createElement('button');
  today.type = 'button';
  today.className = 'week-today';
  today.textContent = 'Hoy';
  today.addEventListener('click', handlers.onToday);

  bar.append(prev, label, next, today);
  return bar;
}
