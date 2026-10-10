import { PLATE_MEALS } from '../constants.js';

export function groupDays(rows) {
  const days = {};
  for (const row of rows) {
    const day = (days[row.date] ||= {});
    day[row.meal] = PLATE_MEALS.includes(row.meal)
      ? {
          free: row.is_free === 1,
          veg: row.veg || '',
          prot: row.prot || '',
          carb: row.carb || '',
        }
      : { fruit: row.fruit || '' };
  }
  return days;
}
