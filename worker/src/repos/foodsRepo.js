import { conflict } from '../errors.js';
import { touchStatement } from './metaRepo.js';

function isUniqueViolation(err) {
  const text = `${err?.message ?? ''} ${err?.cause?.message ?? ''}`;
  return /UNIQUE/i.test(text);
}

export async function listFoods(db) {
  const { results } = await db
    .prepare('SELECT id, category, name FROM foods ORDER BY category, name COLLATE NOCASE')
    .all();
  return results;
}

export async function addFood(db, category, name) {
  const insert = db
    .prepare('INSERT INTO foods (category, name) VALUES (?, ?)')
    .bind(category, name);
  try {
    const [result] = await db.batch([insert, touchStatement(db)]);
    return { id: result.meta.last_row_id, category, name };
  } catch (err) {
    if (isUniqueViolation(err)) throw conflict(`"${name}" ya existe en esa lista`);
    throw err;
  }
}

export async function removeFood(db, id) {
  const [result] = await db.batch([
    db.prepare('DELETE FROM foods WHERE id = ?').bind(id),
    touchStatement(db),
  ]);
  return result.meta.changes > 0;
}
