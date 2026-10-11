import { getState, setState } from '../state.js';
import { addMonths, monthGrid, monthStart, todayISO } from '../domain/dates.js';
import { dayStatus } from '../domain/rules.js';
import { fetchPlan } from '../api/planApi.js';
import { loadWithCache } from '../store/dataCache.js';
import { onDataChange } from '../store/dataEvents.js';
import { renderMonthHeader } from '../ui/monthHeader.js';
import { renderMonthGrid } from '../ui/monthGrid.js';
import { renderDayDetail } from '../ui/dayDetail.js';
import { autofillDays } from './autofill.js';

// Último mes cargado, para repintar al instante al seleccionar un día.
let memory = null; // { from, to, days }
let requestId = 0;

// Olvida el mes en memoria (se usa tras guardar o borrar un día).
export function resetMonthMemory() {
  memory = null;
}
onDataChange(resetMonthMemory);

function draw(container, dates, days) {
  const { selectedDate, calendarMonth } = getState();

  const header = renderMonthHeader(calendarMonth, {
    onPrev: () => setState({ calendarMonth: addMonths(calendarMonth, -1) }),
    onNext: () => setState({ calendarMonth: addMonths(calendarMonth, 1) }),
    onToday: () => setState({ calendarMonth: monthStart(todayISO()), selectedDate: todayISO() }),
  });

  const grid = renderMonthGrid({
    dates,
    month: calendarMonth,
    selected: selectedDate,
    statusOf: (date) => dayStatus(days[date]),
    onSelect: (date) => setState({ selectedDate: date, calendarMonth: monthStart(date) }),
  });

  const wrap = document.createElement('div');
  wrap.className = 'week';
  wrap.append(header, grid);

  // El detalle solo se muestra si el día seleccionado está dentro de lo cargado.
  if (dates.includes(selectedDate)) {
    wrap.append(
      renderDayDetail(
        selectedDate,
        days[selectedDate],
        (d) => setState({ editingDate: d }),
        (d) => autofillDays([d], d)
      )
    );
  } else {
    const hint = document.createElement('p');
    hint.className = 'muted cal-hint';
    hint.textContent = 'Toca un día para ver su menú.';
    wrap.append(hint);
  }

  container.replaceChildren(wrap);
}

function isActive(id) {
  return id === requestId && getState().tab === 'calendario' && !getState().editingDate;
}

async function refresh(container, dates) {
  const myId = ++requestId;
  const from = dates[0];
  const to = dates[dates.length - 1];

  try {
    const { data, source } = await loadWithCache(`plan:${from}:${to}`, () => fetchPlan(from, to));
    if (!isActive(myId)) return;

    const sameRange = memory && memory.from === from && memory.to === to;
    memory = { from, to, days: data.days };
    if (!sameRange || source === 'red') draw(container, dates, data.days);
  } catch (err) {
    if (!isActive(myId)) return;
    if (memory && memory.from === from && memory.to === to) return;
    container.innerHTML = `<section class="placeholder">
      <p>No se pudo cargar el calendario.</p>
      <p class="muted">${err.message}</p></section>`;
  }
}

export function renderCalendario(container) {
  const dates = monthGrid(getState().calendarMonth);
  const from = dates[0];
  const to = dates[dates.length - 1];

  if (memory && memory.from === from && memory.to === to) {
    draw(container, dates, memory.days);
  } else {
    container.innerHTML = '<section class="placeholder"><p class="muted">Cargando…</p></section>';
  }

  refresh(container, dates);
}
