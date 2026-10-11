import { weekDates, weekStart } from './dates.js';

const FRUIT_MEALS = ['mediamanana', 'merienda'];
const PLATE_MEALS = ['comida', 'cena'];
const SLOT_KEYS = ['fruit', 'veg', 'prot', 'carb'];

// A partir de cuántas veces en la semana se avisa de que un alimento se repite.
export const REPEAT_LIMIT = 3;

// Cuántas veces aparece un alimento en un día (los días libres no cuentan).
export function countInDay(day, food) {
  if (!day) return 0;
  let count = 0;

  FRUIT_MEALS.forEach((meal) => {
    if (day[meal] && day[meal].fruit === food) count += 1;
  });

  PLATE_MEALS.forEach((meal) => {
    const slot = day[meal];
    if (!slot || slot.free) return;
    [slot.veg, slot.prot, slot.carb].forEach((item) => {
      if (item === food) count += 1;
    });
  });

  return count;
}

// Cuántas veces aparece un alimento en la semana de `date`,
// usando el borrador para el día que se está editando y lo guardado para el resto.
export function weekCount(food, date, draft, days) {
  return weekDates(weekStart(date)).reduce(
    (sum, d) => sum + countInDay(d === date ? draft : days[d], food),
    0
  );
}

// Alimentos recién elegidos en una comida (distintos de `previous`) que llegan al límite.
// Devuelve [{ food, count }].
export function newlyRepeated(previous, slot, date, draft, days) {
  return SLOT_KEYS.filter((key) => slot[key] && slot[key] !== previous[key])
    .map((key) => ({ food: slot[key], count: weekCount(slot[key], date, draft, days) }))
    .filter((item) => item.count >= REPEAT_LIMIT);
}
