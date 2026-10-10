import { badRequest } from '../errors.js';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_RANGE_DAYS = 62;

export function parseDate(value) {
  if (typeof value !== 'string' || !DATE_RE.test(value)) {
    throw badRequest('Fecha inválida, usa el formato AAAA-MM-DD');
  }
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
    throw badRequest('La fecha no existe');
  }
  return value;
}

export function parseRange(from, to) {
  const start = parseDate(from);
  const end = parseDate(to);
  if (start > end) throw badRequest('"from" no puede ser posterior a "to"');
  const days = (Date.parse(end) - Date.parse(start)) / 86400000;
  if (days > MAX_RANGE_DAYS) {
    throw badRequest(`El rango no puede pasar de ${MAX_RANGE_DAYS} días`);
  }
  return { from: start, to: end };
}
