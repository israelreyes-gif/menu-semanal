import { addDays, dayName, weekDates, weekStart } from './dates.js';

const FRUIT_MEALS = ['mediamanana', 'merienda'];
const PLATE_MEALS = ['comida', 'cena'];

// Alimentos que aparecen en un día (los días libres no cuentan).
export function foodsOfDay(day) {
  const foods = new Set();
  if (!day) return foods;

  FRUIT_MEALS.forEach((meal) => {
    const fruit = day[meal] && day[meal].fruit;
    if (fruit) foods.add(fruit);
  });

  PLATE_MEALS.forEach((meal) => {
    const slot = day[meal];
    if (!slot || slot.free) return;
    [slot.veg, slot.prot, slot.carb].forEach((food) => {
      if (food) foods.add(food);
    });
  });

  return foods;
}

// Avisos de variedad para el día `date` que se está editando.
// `draft` es el borrador del día y `days` los días ya guardados de la semana.
export function varietyNotes(date, draft, days) {
  const others = weekDates(weekStart(date)).filter((d) => d !== date);
  const yesterday = addDays(date, -1);
  const tomorrow = addDays(date, 1);
  const notes = [];

  foodsOfDay(draft).forEach((food) => {
    const sameFood = others.filter((d) => foodsOfDay(days[d]).has(food));

    if (sameFood.length >= 2) {
      notes.push(`${food}: ya está en ${sameFood.length} días más esta semana.`);
    } else if (sameFood.includes(yesterday)) {
      notes.push(`${food}: también estaba ayer (${dayName(yesterday)}).`);
    } else if (sameFood.includes(tomorrow)) {
      notes.push(`${food}: también está mañana (${dayName(tomorrow)}).`);
    }
  });

  return notes;
}
