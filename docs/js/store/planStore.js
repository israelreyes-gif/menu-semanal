import { fetchPlan } from '../api/planApi.js';
import { loadWithCache, invalidate } from './dataCache.js';
import { addDays } from '../domain/dates.js';

const keyOf = (start) => `plan:${start}`;

// Carga los 7 días de la semana que empieza en `start` (un sábado).
export function loadWeek(start) {
  return loadWithCache(keyOf(start), () => fetchPlan(start, addDays(start, 6)));
}

// Borra la copia local de esa semana (se usará tras guardar un día).
export function invalidateWeek(start) {
  invalidate(keyOf(start));
}
