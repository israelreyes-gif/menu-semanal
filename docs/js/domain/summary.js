// Textos para resumir una comida o un día.

export const MEAL_ORDER = ['mediamanana', 'comida', 'merienda', 'cena'];

export const MEAL_LABELS = {
  mediamanana: 'Media mañana',
  comida: 'Comida',
  merienda: 'Merienda',
  cena: 'Cena',
};

const EMPTY_TEXT = 'Sin diseñar';

// Devuelve el texto que se muestra para una comida concreta.
export function mealText(meal, slot) {
  if (!slot) return EMPTY_TEXT;

  if (meal === 'mediamanana' || meal === 'merienda') {
    return slot.fruit || EMPTY_TEXT;
  }

  if (slot.free) return 'Día libre';

  const parts = [slot.veg, slot.prot, slot.carb].filter(Boolean);
  if (parts.length === 0) return EMPTY_TEXT;
  return parts.length === 3 ? parts.join(' · ') : `${parts.join(' · ')} …`;
}
