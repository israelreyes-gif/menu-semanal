import { getState, setState } from '../state.js';
import { weekStart, weekDates, addDays, todayISO } from '../domain/dates.js';
import { dayStatus, STATUS } from '../domain/rules.js';
import { weekText } from '../domain/weekText.js';
import { loadWeek } from '../store/planStore.js';
import { onDataChange } from '../store/dataEvents.js';
import { renderWeekHeader } from '../ui/weekHeader.js';
import { renderDayRow } from '../ui/dayRow.js';
import { renderDayDetail } from '../ui/dayDetail.js';
import { renderShareButton } from '../ui/shareButton.js';
import { iconButton } from '../ui/iconButton.js';
import { showConfirm } from '../ui/modal.js';
import { autofillDays } from './autofill.js';

// Última semana cargada, para repintar al instante al seleccionar un día.
let memory = null; // { start, days }
let requestId = 0;

// Olvida la semana en memoria (se usa tras guardar o borrar un día).
export function resetWeekMemory() {
  memory = null;
}
onDataChange(resetWeekMemory);

function autofillWeekButton(start) {
  const button = iconButton('sparkles', 'Autocompletar semana', 'soft-btn', async () => {
    const ok = await showConfirm(
      'Se rellenarán los huecos de los 7 días con alimentos de tu lista. Lo que ya has elegido no se toca.',
      { title: 'Autocompletar semana', okLabel: 'Autocompletar' }
    );
    if (!ok) return;

    button.disabled = true;
    button.querySelector('span').textContent = 'Rellenando…';
    await autofillDays(weekDates(start), start, { notify: true });
  });
  return button;
}

function draw(container, start, days) {
  const { selectedDate } = getState();
  const dates = weekDates(start);

  const header = renderWeekHeader(start, {
    onPrev: () => setState({ selectedDate: addDays(start, -7) }),
    onNext: () => setState({ selectedDate: addDays(start, 7) }),
    onToday: () => setState({ selectedDate: todayISO() }),
  });

  const list = document.createElement('div');
  list.className = 'day-list';
  dates.forEach((date) => {
    list.append(
      renderDayRow(date, dayStatus(days[date]), date === selectedDate, (d) =>
        setState({ selectedDate: d })
      )
    );
  });

  const detail = renderDayDetail(
    selectedDate,
    days[selectedDate],
    (d) => setState({ editingDate: d }),
    (d) => autofillDays([d], d)
  );

  const wrap = document.createElement('div');
  wrap.className = 'week';
  wrap.append(header, list, detail);

  // Autocompletar solo aparece si a la semana le falta algo.
  if (dates.some((date) => dayStatus(days[date]) !== STATUS.COMPLETE)) {
    wrap.append(autofillWeekButton(start));
  }

  // Compartir solo tiene sentido si la semana tiene algo diseñado.
  if (dates.some((date) => days[date])) {
    wrap.append(
      renderShareButton({
        label: 'Compartir semana',
        title: 'Menú semanal',
        getText: () => weekText(start, days),
      })
    );
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
