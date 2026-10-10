import { touchStatement } from './metaRepo.js';

export async function listDays(db, from, to) {
  const { results } = await db
    .prepare(
      'SELECT date, meal, is_free, veg, prot, carb, fruit FROM day_meals WHERE date BETWEEN ? AND ? ORDER BY date'
    )
    .bind(from, to)
    .all();
  return results;
}

export async function saveDay(db, date, rows) {
  const upsert = db.prepare(`
    INSERT INTO day_meals (date, meal, is_free, veg, prot, carb, fruit, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    ON CONFLICT (date, meal) DO UPDATE SET
      is_free = excluded.is_free,
      veg = excluded.veg,
      prot = excluded.prot,
      carb = excluded.carb,
      fruit = excluded.fruit,
      updated_at = excluded.updated_at
  `);
  const statements = rows.map((r) =>
    upsert.bind(date, r.meal, r.is_free, r.veg, r.prot, r.carb, r.fruit)
  );
  await db.batch([...statements, touchStatement(db)]);
}

export async function deleteDay(db, date) {
  await db.batch([
    db.prepare('DELETE FROM day_meals WHERE date = ?').bind(date),
    touchStatement(db),
  ]);
}
