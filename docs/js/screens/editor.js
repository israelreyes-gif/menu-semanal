import { getState, setState } from '../state.js';
import { weekStart, longLabel } from '../domain/dates.js';
import { createDraft, toPayload } from '../domain/dayDraft.js';
import { newlyRepeated } from '../domain/variety.js';
import { fillDraft } from '../domain/suggest.js';
import { fetchFoods } from '../api/foodsApi.js';
import { saveDay, deleteDay } from '../api/planApi.js';
import { loadWithCache } from '../store/dataCache.js';
import { loadWeek, invalidateWeek } from '../store/planStore.js';
import { resetWeekMemory } from './semana.js';
import { resetMonthMemory } from './calendario.js';
import { renderFruitMeal } from '../ui/fruitMeal.js';
import { renderPlateMeal } from '../ui/plateMeal.js';
import { iconButton } from '../ui/iconButton.js';
import { showAlert, showConfirm } from '../ui/modal.js';

const names = (list) => (list || []).map((f) => f.name);

function closeEditor(date) {
  setState({ editingDate: null, selectedDate: date });
}

// `days` son todos los días guardados de la semana (el día editado es days[date]).
function startEditor(container, date, foods, days) {
  const day = days[date];
  let draft = createDraft(day);
  const original = JSON.stringify(draft);
  const existed = Boolean(day);
  let busy = false;

  const available = {
    veg: names(foods.veg),
    prot: names(foods.prot),
    carb: names(foods.carb),
    fruit: names(foods.fruit),
  };

  const setSlot = (meal, slot) => {
    const previous = draft[meal];
    draft = { ...draft, [meal]: slot };
    paint();

    // Avisa si un alimento recién elegido llega al límite de repeticiones de la semana.
    newlyRepeated(previous, slot, date, draft, days).forEach(({ food, count }) => {
      showAlert(
        `"${food}" ya aparece ${count} veces esta semana, contando este día. ` +
          'Puedes dejarlo, pero quizá convenga variar.',
        { title: 'Alimento repetido' }
      );
    });
  };

  function fillGaps() {
    const result = fillDraft(draft, available, date, days);
    if (result.filled === 0) {
      showAlert(
        'No hay huecos que rellenar, o faltan alimentos en la lista para los que están vacíos.',
        { title: 'Nada que rellenar' }
      );
      return;
    }
    draft = result.draft;
    paint();
  }

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
    bar.append(iconButton('back', 'Volver', 'back-btn', goBack), title);

    const actions = document.createElement('div');
    actions.className = 'editor-actions';
    actions.append(iconButton('check', 'Guardar día', 'btn-primary', save));
    if (existed) actions.append(iconButton('trash', 'Borrar día', 'btn-ghost', remove));

    wrap.append(
      bar,
      iconButton('sparkles', 'Rellenar huecos', 'soft-btn', fillGaps),
      renderFruitMeal({
        title: 'Media mañana',
        fruits: available.fruit,
        slot: draft.mediamanana,
        onChange: (s) => setSlot('mediamanana', s),
      }),
      renderPlateMeal({
        title: 'Comida',
        foods: available,
        slot: draft.comida,
        onChange: (s) => setSlot('comida', s),
      }),
      renderFruitMeal({
        title: 'Merienda',
        fruits: available.fruit,
        slot: draft.merienda,
        onChange: (s) => setSlot('merienda', s),
      }),
      renderPlateMeal({
        title: 'Cena',
        foods: available,
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
