import { getState, setState } from '../state.js';
import { weekStart, addDays, todayISO } from '../domain/dates.js';
import { loadWeek } from '../store/planStore.js';
import { buildShoppingList, isListEmpty } from '../domain/shopping.js';
import { shoppingText } from '../domain/shoppingText.js';
import { renderWeekHeader } from '../ui/weekHeader.js';
import { renderShoppingList } from '../ui/shoppingList.js';
import { renderShareButton } from '../ui/shareButton.js';

let requestId = 0;

function draw(container, start, days) {
  const header = renderWeekHeader(start, {
    onPrev: () => setState({ selectedDate: addDays(start, -7) }),
    onNext: () => setState({ selectedDate: addDays(start, 7) }),
    onToday: () => setState({ selectedDate: todayISO() }),
  });

  const wrap = document.createElement('div');
  wrap.className = 'week';
  wrap.append(header);

  const list = buildShoppingList(days, start);

  if (isListEmpty(list)) {
    const empty = document.createElement('p');
    empty.className = 'muted cal-hint';
    empty.textContent = 'Esta semana aún no tiene alimentos. Diseña algún día en la pestaña Semana.';
    wrap.append(empty);
  } else {
    wrap.append(
      renderShoppingList(list),
      renderShareButton({
        label: 'Compartir lista',
        title: 'Lista de la compra',
        getText: () => shoppingText(start, list),
      })
    );
  }

  container.replaceChildren(wrap);
}

function isActive(id) {
  return id === requestId && getState().tab === 'compra' && !getState().editingDate;
}

async function load(container, start) {
  const myId = ++requestId;
  try {
    const { data } = await loadWeek(start);
    if (!isActive(myId)) return;
    draw(container, start, data.days);
  } catch (err) {
    if (!isActive(myId)) return;
    container.innerHTML = `<section class="placeholder">
      <p>No se pudo cargar la lista.</p>
      <p class="muted">${err.message}</p></section>`;
  }
}

export function renderCompra(container) {
  container.innerHTML = '<section class="placeholder"><p class="muted">Cargando…</p></section>';
  load(container, weekStart(getState().selectedDate));
}
