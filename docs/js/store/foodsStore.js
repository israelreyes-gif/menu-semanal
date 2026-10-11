import { fetchFoods } from '../api/foodsApi.js';
import { loadWithCache } from './dataCache.js';

const names = (list) => (list || []).map((f) => f.name);

// Nombres de los alimentos por categoría: { veg, prot, carb, fruit }.
export async function loadFoodNames() {
  const { data } = await loadWithCache('foods', fetchFoods);
  const { foods } = data;
  return {
    veg: names(foods.veg),
    prot: names(foods.prot),
    carb: names(foods.carb),
    fruit: names(foods.fruit),
  };
}
