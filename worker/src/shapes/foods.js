import { CATEGORIES } from '../constants.js';

export function groupFoods(rows) {
  const grouped = Object.fromEntries(CATEGORIES.map((c) => [c, []]));
  for (const { id, category, name } of rows) {
    grouped[category].push({ id, name });
  }
  return grouped;
}
