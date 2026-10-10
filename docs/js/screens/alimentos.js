import { fetchFoods, addFood, removeFood } from '../api/foodsApi.js';
import { loadWithCache, invalidate } from '../store/dataCache.js';
import { FOOD_CATEGORIES } from '../domain/categories.js';
import { renderFoodSection } from '../ui/foodSection.js';
import { getState } from '../state.js';

const CACHE_KEY = 'foods';

function showMessage(container, text) {
  const box = container.querySelector('.status');
  if (box) box.textContent = text;
}

// Ejecuta una escritura, refresca la lista y muestra el error si lo hay.
async function runAction(container, action) {
  try {
    await action();
    invalidate(CACHE_KEY);
    await load(container);
  } catch (err) {
    showMessage(container, err.status === 409 ? 'Ese alimento ya existe.' : `Error: ${err.message}`);
  }
}

function draw(container, foods) {
  const handlers = {
    onAdd: (category, name) => runAction(container, () => addFood(category, name)),
    onRemove: (food) => {
      if (window.confirm(`¿Quitar "${food.name}"?`)) {
        runAction(container, () => removeFood(food.id));
      }
    },
  };

  container.innerHTML = '<div class="foods"><p class="status muted"></p></div>';
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
