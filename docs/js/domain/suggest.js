import { MEAL_ORDER } from './summary.js';
import { weekCount } from './variety.js';

const FRUIT_MEALS = ['mediamanana', 'merienda'];
const PLATE_FIELDS = ['veg', 'prot', 'carb'];

// Elige el alimento que menos aparece en la semana; si hay empate, al azar.
function pickLeastUsed(options, date, draft, days) {
  let best = [];
  let min = Infinity;

  options.forEach((food) => {
    const count = weekCount(food, date, draft, days);
    if (count < min) {
      min = count;
      best = [food];
    } else if (count === min) {
      best.push(food);
    }
  });

  return best[Math.floor(Math.random() * best.length)];
}

// Rellena los huecos vacíos del borrador sin tocar lo ya elegido ni los días libres.
// `foods` es { veg, prot, carb, fruit } con listas de nombres.
// Devuelve { draft, filled } con el nuevo borrador y cuántos huecos se rellenaron.
export function fillDraft(draft, foods, date, days) {
  let current = draft;
  let filled = 0;

  const fillField = (meal, field, options) => {
    if (options.length === 0 || current[meal][field]) return;
    const food = pickLeastUsed(options, date, current, days);
    current = { ...current, [meal]: { ...current[meal], [field]: food } };
    filled += 1;
  };

  MEAL_ORDER.forEach((meal) => {
    if (FRUIT_MEALS.includes(meal)) {
      fillField(meal, 'fruit', foods.fruit);
      return;
    }
    if (current[meal].free) return;
    PLATE_FIELDS.forEach((field) => fillField(meal, field, foods[field]));
  });

  return { draft: current, filled };
}
