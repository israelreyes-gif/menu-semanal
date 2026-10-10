import { get, put, del } from './client.js';

// Devuelve { days: { 'YYYY-MM-DD': {...} }, dataUpdatedAt } entre dos fechas (ambas incluidas).
export function fetchPlan(from, to) {
  return get(`/api/plan?from=${from}&to=${to}`);
}

// Guarda el día completo. Si el día llega vacío, el servidor lo borra.
export function saveDay(date, day) {
  return put(`/api/plan/${date}`, day);
}

// Borra el día entero.
export function deleteDay(date) {
  return del(`/api/plan/${date}`);
}
