import { getState, setState } from '../state.js';
import { weekStart, longLabel } from '../domain/dates.js';
import { createDraft, toPayload } from '../domain/dayDraft.js';
import { varietyNotes } from '../domain/variety.js';
import { fetchFoods } from '../api/foodsApi.js';
import { saveDay, deleteDay } from '../api/planApi.js';
import { loadWithCache } from '../store/dataCache.js';
import { loadWeek, invalidateWeek } from '../store/planStore.js';
import { resetWeekMemory } from './semana.js';
import { resetMonthMemory } from './calendario.js';
import { renderFruitMeal } from '../ui/fruitMeal.js';
import { renderPlateMeal } from '../ui/plateMeal.js';
import { renderVarietyNote } from '../ui/varietyNote.js';
import { showAlert, showConfirm } from '../ui/modal.js';
import { icon } from '../ui/icons.js';

const names = (list) => (list || []).map((f) => f.name);

function closeEditor(date) {
  setState({ editingDate: null, selectedDate: date });
}

function button(iconName, text, className, onClick) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = className;
  b.innerHTML = `${icon(iconName)}<span>${text}</span>`;
  b.addEventListener('click', onClick);
  return b;
}

// `days` son todos los días guardados de la semana (el día editado es days[date]).
function startEditor(container, date, foods, days) {
  const day = days[date];
  let draft = createDraft(day);
  const original = JSON.stringify(draft);
  const existed = Boolean(day);
  let busy = false;

  const setSlot = (meal, slot) => {
    draft = { ...draft, [meal]: slot };
    paint();
  };

  async function goBack() {
    if (JSON.stringify(draft) !== original) {
      const ok = await showConfirm('Hay cambios sin guardar. ¿Salir igualmente?', {
        title: 'Salir sin guardar',
        okLabel: 'Salir',
        cancelLabel: 'Seguir editando',
      });
      if (!ok) return;
    }
    closeEditor(date);
  }

  async function afterWrite() {
    invalidateWeek(weekStart(date));
    resetWeekMemory();
    resetMonthMemory();
    closeEditor(date);
  }

  async function save() {
    if (busy) return;
    busy = true;
    try {
      await saveDay(date, toPayload(draft));
      await afterWrite();
    } catch (err) {
      busy = false;
      showAlert(err.message, { title: 'No se pudo guardar' });
    }
  }

  async function remove() {
    if (busy) return;
    const ok = await showConfirm('Se borrará el menú de este día.', {
      title: 'Borrar día',
      okLabel: 'Borrar',
    });
    if (!ok) return;
    busy = true;
    try {
      await deleteDay(date);
      await afterWrite();
    } catch (err) {
      busy = false;
      showAlert(err.message, { title: 'No se pudo borrar' });
    }
  }

  function build() {
    const wrap = document.createElement('div');
    wrap.className = 'editor';

    const bar = document.createElement('div');
    bar.className = 'editor-bar';
    const title = document.createElement('h2');
    title.textContent = longLabel(date);
    bar.append(button('back', 'Volver', 'back-btn', goBack), title);
    wrap.append(bar);

    const note = renderVarietyNote(varietyNotes(date, draft, days));
    if (note) wrap.append(note);

    const fruits = names(foods.fruit);
    const plateFoods = {
      veg: names(foods.veg),
      prot: names(foods.prot),
      carb: names(foods.carb),
    };

    const actions = document.createElement('div');
    actions.className = 'editor-actions';
    actions.append(button('check', 'Guardar día', 'btn-primary', save));
    if (existed) actions.append(button('trash', 'Borrar día', 'btn-ghost', remove));

    wrap.append(
      renderFruitMeal({
        title: 'Media mañana',
        fruits,
        slot: draft.mediamanana,
        onChange: (s) => setSlot('mediamanana', s),
      }),
      renderPlateMeal({
        title: 'Comida',
        foods: plateFoods,
        slot: draft.comida,
        onChange: (s) => setSlot('comida', s),
      }),
      renderFruitMeal({
        title: 'Merienda',
        fruits,
        slot: draft.merienda,
        onChange: (s) => setSlot('merienda', s),
      }),
      renderPlateMeal({
        title: 'Cena',
        foods: plateFoods,
        slot: draft.cena,
        onChange: (s) => setSlot('cena', s),
      }),
      actions
    );
    return wrap;
  }

  function paint() {
    const top = container.scrollTop;
    container.replaceChildren(build());
    container.scrollTop = top;
  }

  paint();
}

export async function renderEditor(container, date) {
  container.innerHTML = '<section class="placeholder"><p class="muted">Cargando…</p></section>';
  try {
    const [foodsRes, weekRes] = await Promise.all([
      loadWithCache('foods', fetchFoods),
      loadWeek(weekStart(date)),
    ]);
    // Si mientras cargaba el usuario salió del editor, no se dibuja.
    if (getState().editingDate !== date) return;
    startEditor(container, date, foodsRes.data.foods, weekRes.data.days);
  } catch (err) {
    if (getState().editingDate !== date) return;
    container.innerHTML = `<section class="placeholder">
      <p>No se pudo abrir el editor.</p>
      <p class="muted">${err.message}</p></section>`;
  }
}
