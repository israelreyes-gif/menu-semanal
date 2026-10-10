import { APP_NAME } from './config.js';
import { registerServiceWorker } from './pwa/registerSw.js';
import { fetchFoods, addFood, removeFood } from './api/foodsApi.js';
import { fetchPlan, saveDay, deleteDay } from './api/planApi.js';

const screen = document.getElementById('screen');
const log = [];

function show() {
  screen.innerHTML = `<p>${APP_NAME}: prueba de API</p>` +
    log.map((l) => `<p>${l}</p>`).join('');
}

async function paso(nombre, fn) {
  try {
    const r = await fn();
    log.push(`✅ ${nombre}${r ? ': ' + r : ''}`);
  } catch (err) {
    log.push(`❌ ${nombre}: ${err.message}`);
  }
  show();
}

async function boot() {
  show();
  let id;

  await paso('Leer alimentos', async () => {
    const { foods } = await fetchFoods();
    return `${foods.veg.length} verduras, ${foods.fruit.length} frutas`;
  });

  await paso('Añadir alimento', async () => {
    const { food } = await addFood('veg', 'prueba');
    id = food.id;
    return food.name;
  });

  await paso('Borrar alimento', async () => {
    await removeFood(id);
  });

  await paso('Guardar día', async () => {
    const day = {
      mediamanana: { fruit: 'Manzana' },
      comida: { free: true },
      merienda: { fruit: 'Pera' },
      cena: { free: true },
    };
    await saveDay('2026-10-10', day);
  });

  await paso('Leer menú', async () => {
    const { days } = await fetchPlan('2026-10-10', '2026-10-16');
    return `${Object.keys(days).length} día(s) guardado(s)`;
  });

  await paso('Borrar día', async () => {
    await deleteDay('2026-10-10');
  });
}

registerServiceWorker();
boot();
