// Qué comida toca según la hora del día.
// Hasta las 12:00 media mañana, hasta las 16:00 comida, hasta las 19:00 merienda, después cena.
export function currentMeal(now = new Date()) {
  const hour = now.getHours();
  if (hour < 12) return 'mediamanana';
  if (hour < 16) return 'comida';
  if (hour < 19) return 'merienda';
  return 'cena';
}
