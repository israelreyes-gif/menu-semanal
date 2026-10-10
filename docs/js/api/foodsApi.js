import { get, post, del } from './client.js';

// Devuelve { foods: { veg:[{id,name}], prot:[], carb:[], fruit:[] }, dataUpdatedAt }
export function fetchFoods() {
  return get('/api/foods');
}

// Añade un alimento. Devuelve { food }. Lanza ApiError 409 si ya existe.
export function addFood(category, name) {
  return post('/api/foods', { category, name });
}

// Borra un alimento por id.
export function removeFood(id) {
  return del(`/api/foods/${id}`);
}
