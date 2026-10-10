import { fetchFoods, addFood, removeFood } from '../api/foodsApi.js';
import { loadWithCache, invalidate } from '../store/dataCache.js';
import { FOOD_CATEGORIES } from '../domain/categories.js';
import { renderFoodSection } from '../ui/foodSection.js';
import { showAlert, showConfirm } from '../ui/modal.js';
import { getState } from '../state.js';

const CACHE_KEY = 'foods';

// Ejecuta una escritura, refresca la lista y avisa con un modal si algo falla.
async function runAction(container, action) {
  try {
    await action();
    invalidate(CACHE_KEY);
    await load(container);
  } catch (err) {
    if (err.status === 409) {
      showAlert('Ese alimento ya existe en esta lista.', { title: 'Alimento repetido' });
    } else {
      showAlert(err.message, { title: 'No se pudo guardar' });
    }
  }
}

function draw(container, foods) {
  const handlers = {
    onAdd: (category, name) => runAction(container, () => addFood(category, name)),
    onRemove: async (food) => {
      const ok = await showConfirm(`¿Quitar "${food.name}" de la lista?`, {
        title: 'Quitar alimento',
        okLabel: 'Quitar',
      });
      if (ok) runAction(container, () => removeFood(food.id));
    },
  };

  container.innerHTML = '<div class="foods"></div>';
  const wrap = container.querySelector('.foods');
  FOOD_CATEGORIES.forEach((cat) => {
    wrap.append(renderFoodSection(cat, foods[cat.id] || [], handlers));
  });
}

async function load(container) {
  try {
    const { data } = await loadWithCache(CACHE_KEY, fetchFoods);
    // Si mientras cargaba el usuario cambió de pestaña, no se dibuja.
    if (getState().tab !== 'alimentos') return;
    draw(container, data.foods);
  } catch (err) {
    if (getState().tab !== 'alimentos') return;
    container.innerHTML = `<section class="placeholder">
      <p>No se pudieron cargar los alimentos.</p>
      <p class="muted">${err.message}</p></section>`;
  }
}

export function renderAlimentos(container) {
  container.innerHTML = '<section class="placeholder"><p class="muted">Cargando…</p></section>';
  load(container);
}
