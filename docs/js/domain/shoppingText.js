import { addDays, dayNumber, monthName } from './dates.js';
import { FOOD_CATEGORIES } from './categories.js';

const short = (iso) => `${dayNumber(iso)} ${monthName(iso).slice(0, 3)}`;

// Texto de la lista para compartir o copiar.
export function shoppingText(start, list) {
  const lines = [`Lista de la compra (${short(start)} – ${short(addDays(start, 6))})`];

  FOOD_CATEGORIES.forEach((cat) => {
    const items = list[cat.id] || [];
    if (items.length === 0) return;
    lines.push('', cat.label);
    items.forEach((item) => {
      lines.push(`- ${item.name}${item.count > 1 ? ` ×${item.count}` : ''}`);
    });
  });

  return lines.join('\n');
}
