import { MAX_NAME_LENGTH, MEALS, PLATE_MEALS } from '../constants.js';
import { badRequest } from '../errors.js';

function optionalText(value, label) {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string') throw badRequest(`${label} debe ser texto`);
  const text = value.trim();
  if (text.length > MAX_NAME_LENGTH) throw badRequest(`${label} es demasiado largo`);
  return text || null;
}

function plateRow(meal, source) {
  return {
    meal,
    is_free: source.free === true ? 1 : 0,
    veg: optionalText(source.veg, `${meal}.veg`),
    prot: optionalText(source.prot, `${meal}.prot`),
    carb: optionalText(source.carb, `${meal}.carb`),
    fruit: null,
  };
}

function fruitRow(meal, source) {
  return {
    meal,
    is_free: 0,
    veg: null,
    prot: null,
    carb: null,
    fruit: optionalText(source.fruit, `${meal}.fruit`),
  };
}

export function parseDay(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw badRequest('El día debe ser un objeto');
  }
  return MEALS.map((meal) => {
    const source = body[meal] ?? {};
    if (typeof source !== 'object' || Array.isArray(source)) {
      throw badRequest(`"${meal}" no es válido`);
    }
    return PLATE_MEALS.includes(meal) ? plateRow(meal, source) : fruitRow(meal, source);
  });
}

export function isEmptyDay(rows) {
  return rows.every((r) => !r.is_free && !r.veg && !r.prot && !r.carb && !r.fruit);
}
