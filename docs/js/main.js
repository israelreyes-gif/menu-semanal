import { APP_NAME } from './config.js';
import { registerServiceWorker } from './pwa/registerSw.js';
import { fetchFoods, addFood, removeFood } from './api/foodsApi.js';
import { loadWithCache } from './store/dataCache.js';

const screen = document.getElementById('screen');

function show(lines) {
  screen.innerHTML =
    `<p>${APP_NAME}: prueba de caché</p>` +
    lines.map((l) => `<p>${l}</p>`).join('') +
    `<p><button id="btn-write">Añadir y borrar un alimento</button></p>`;
  document.getElementById('btn-write').onclick = writeTest;
}

async function load() {
  try {
    const { data, source } = await loadWithCache('foods', fetchFoods);
    show([`Alimentos cargados desde: <b>${source}</b>`,
          `Verduras: ${data.foods.veg.length}`]);
  } catch (err) {
    show([`Error: ${err.message}`]);
  }
}

async function writeTest() {
  const { food } = await addFood('veg', 'prueba');
  await removeFood(food.id);
  await load();
}

registerServiceWorker();
load();
