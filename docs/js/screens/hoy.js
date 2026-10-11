import { getState, setState } from '../state.js';
import { weekStart, todayISO, longLabel } from '../domain/dates.js';
import { dayStatus, STATUS } from '../domain/rules.js';
import { currentMeal } from '../domain/currentMeal.js';
import { loadWeek } from '../store/planStore.js';
import { renderTodayMeals } from '../ui/todayMeals.js';
import { icon } from '../ui/icons.js';

let requestId = 0;

function draw(container, today, day) {
  const wrap = document.createElement('div');
  wrap.className = 'week';

  const head = document.createElement('div');
  head.className = 'today-head';
  const small = document.createElement('span');
  small.className = 'muted';
  small.textContent = 'Hoy';
  const title = document.createElement('h2');
  title.textContent = longLabel(today);
  head.append(small, title);

  const edit = document.createElement('button');
  edit.type = 'button';
  edit.className = 'edit-btn';
  const label = dayStatus(day) === STATUS.NONE ? 'Diseñar hoy' : 'Editar hoy';
  edit.innerHTML = `${icon('pencil')}<span>${label}</span>`;
  edit.addEventListener('click', () => setState({ editingDate: today }));

  wrap.append(head, renderTodayMeals(day, currentMeal()), edit);
  container.replaceChildren(wrap);
}

function isActive(id) {
  return id === requestId && getState().tab === 'hoy' && !getState().editingDate;
}

async function load(container) {
  const myId = ++requestId;
  const today = todayISO();
  try {
    const { data } = await loadWeek(weekStart(today));
    if (!isActive(myId)) return;
    draw(container, today, data.days[today]);
  } catch (err) {
    if (!isActive(myId)) return;
    container.innerHTML = `<section class="placeholder">
      <p>No se pudo cargar el día de hoy.</p>
      <p class="muted">${err.message}</p></section>`;
  }
}

export function renderHoy(container) {
  container.innerHTML = '<section class="placeholder"><p class="muted">Cargando…</p></section>';
  load(container);
}
