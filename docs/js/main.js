import { APP_NAME } from './config.js';
import { fetchVersion } from './api/versionApi.js';

const screen = document.getElementById('screen');

async function boot() {
  screen.textContent = 'Conectando con la API…';
  try {
    const { dataUpdatedAt } = await fetchVersion();
    screen.textContent = `${APP_NAME}: API conectada (datos del ${dataUpdatedAt})`;
  } catch (err) {
    screen.textContent = `No se pudo conectar con la API: ${err.message}`;
  }
}

boot();
