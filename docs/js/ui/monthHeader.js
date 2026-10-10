import { monthTitle } from '../domain/dates.js';

// Cabecera del calendario: mes y año, flechas y botón Hoy.
// handlers: { onPrev, onNext, onToday }
export function renderMonthHeader(month, handlers) {
  const bar = document.createElement('div');
  bar.className = 'week-header';

  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'week-arrow';
  prev.textContent = '‹';
  prev.setAttribute('aria-label', 'Mes anterior');
  prev.addEventListener('click', handlers.onPrev);

  const label = document.createElement('div');
  label.className = 'week-label';
  label.textContent = monthTitle(month);

  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'week-arrow';
  next.textContent = '›';
  next.setAttribute('aria-label', 'Mes siguiente');
  next.addEventListener('click', handlers.onNext);

  const today = document.createElement('button');
  today.type = 'button';
  today.className = 'week-today';
  today.textContent = 'Hoy';
  today.addEventListener('click', handlers.onToday);

  bar.append(prev, label, next, today);
  return bar;
}
