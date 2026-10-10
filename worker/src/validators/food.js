import { CATEGORIES, MAX_NAME_LENGTH } from '../constants.js';
import { badRequest } from '../errors.js';

export function parseCategory(value) {
  if (!CATEGORIES.includes(value)) {
    throw badRequest(`La categoría debe ser una de: ${CATEGORIES.join(', ')}`);
  }
  return value;
}

export function parseFoodName(value) {
  const name = typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
  if (!name) throw badRequest('El nombre es obligatorio');
  if (name.length > MAX_NAME_LENGTH) {
    throw badRequest(`El nombre no puede pasar de ${MAX_NAME_LENGTH} caracteres`);
  }
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function parseId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) throw badRequest('Identificador inválido');
  return id;
}
