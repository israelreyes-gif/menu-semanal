import { fetchVersion } from '../api/versionApi.js';
import { readJson, writeJson, removeKey } from './storage.js';

// Carga datos aplicando la regla de caché:
//  - fecha local >= fecha del servidor → se usa la copia local
//  - fecha local <  fecha del servidor → se descarga de nuevo
//  - sin conexión → se usa la copia local si existe
// Devuelve { data, source } donde source es 'cache', 'red' o 'cache-offline'.
export async function loadWithCache(key, fetcher) {
  const cached = readJson(key);

  try {
    const { dataUpdatedAt } = await fetchVersion();

    if (cached && cached.dataUpdatedAt >= dataUpdatedAt) {
      return { data: cached.data, source: 'cache' };
    }

    const fresh = await fetcher();
    writeJson(key, { dataUpdatedAt: fresh.dataUpdatedAt, data: fresh });
    return { data: fresh, source: 'red' };
  } catch (err) {
    if (cached) return { data: cached.data, source: 'cache-offline' };
    throw err;
  }
}

// Borra una copia local (útil tras escribir, para forzar la recarga).
export function invalidate(key) {
  removeKey(key);
}
