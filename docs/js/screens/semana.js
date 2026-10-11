import { getState, setState } from '../state.js';
import { weekStart, weekDates, addDays, todayISO } from '../domain/dates.js';
import { dayStatus } from '../domain/rules.js';
import { loadWeek } from '../store/planStore.js';
import { renderWeekHeader } from '../ui/weekHeader.js';
import { renderDayRow } from '../ui/dayRow.js';
import { renderDayDetail } from '../ui/dayDetail.js';
import { renderShareWeekButton } from '../ui/shareWeekButton.js';

// Última semana cargada, para repintar al instante al seleccionar un día.
let memory = null; // { start, days }
let requestId = 0;

// Olvida la semana en memoria (se usa tras guardar o borrar un día).
export function resetWeekMemory() {
  memory = null;
}

function draw(container, start, days) {
  const { selectedDate } = getState();

  const header = renderWeekHeader(start, {
    onPrev: () => setState({ selectedDate: addDays(start, -7) }),
    onNext: () => setState({ selectedDate: addDays(start, 7) }),
    onToday: () => setState({ selectedDate: todayISO() }),
  });

  const list = document.createElement('div');
  list.className = 'day-list';
  weekDates(start).forEach((date) => {
    list.append(
      renderDayRow(date, dayStatus(days[date]), date === selectedDate, (d) =>
        setState({ selectedDate: d })
      )
    );
  });

  const detail = renderDayDetail(selectedDate, days[selectedDate], (d) =>
    setState({ editingDate: d })
  );

  const wrap = document.createElement('div');
  wrap.className = 'week';
  wrap.append(header, list, detail);

  // Compartir solo tiene sentido si la semana tiene algo diseñado.
  if (weekDates(start).some((date) => days[date])) {
    wrap.append(renderShareWeekButton(start, days));
  }

  container.replaceChildren(wrap);
}

async function refresh(container, start) {
  const myId = ++requestId;
  try {
    const { data, source } = await loadWeek(start);
    // Se descarta si el usuario ya cambió de semana o de pestaña.
    if (myId !== requestId || getState().tab !== 'semana' || getState().editingDate) return;

    const changed = !memory || memory.start !== start || source === 'red';
    memory = { start, days: data.days };
    if (changed) draw(container, start, data.days);
  } catch (err) {
    if (myId !== requestId || getState().tab !== 'semana' || getState().editingDate) return;
    if (memory && memory.start === start) return; // ya se ve la copia en memoria
    container.innerHTML = `<section class="placeholder">
      <p>No se pudo cargar la semana.</p>
      <p class="muted">${err.message}</p></section>`;
  }
}

export function renderSemana(container) {
  const start = weekStart(getState().selectedDate);

  if (memory && memory.start === start) {
    draw(container, start, memory.days);
  } else {
    container.innerHTML = '<section class="placeholder"><p class="muted">Cargando…</p></section>';
  }

  refresh(container, start);
}
