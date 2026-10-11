import { weekDates } from './dates.js';

const FRUIT_MEALS = ['mediamanana', 'merienda'];
const PLATE_MEALS = ['comida', 'cena'];

// Cuenta cuántas veces aparece cada alimento en la semana que empieza en `start`.
// Devuelve { veg: [{name, count}], prot: [...], carb: [...], fruit: [...] }
// ordenado de más a menos veces y, si empatan, por nombre. Los días libres no cuentan.
export function buildShoppingList(days, start) {
  const counts = { veg: new Map(), prot: new Map(), carb: new Map(), fruit: new Map() };

  const add = (category, name) => {
    if (!name) return;
    counts[category].set(name, (counts[category].get(name) || 0) + 1);
  };

  weekDates(start).forEach((date) => {
    const day = days[date];
    if (!day) return;

    FRUIT_MEALS.forEach((meal) => add('fruit', day[meal] && day[meal].fruit));

    PLATE_MEALS.forEach((meal) => {
      const slot = day[meal];
      if (!slot || slot.free) return;
      add('veg', slot.veg);
      add('prot', slot.prot);
      add('carb', slot.carb);
    });
  });

  const list = {};
  Object.keys(counts).forEach((category) => {
    list[category] = [...counts[category]]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'es'));
  });
  return list;
}

export function isListEmpty(list) {
  return Object.values(list).every((items) => items.length === 0);
}
