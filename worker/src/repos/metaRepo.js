const KEY = 'data_updated_at';

export function touchStatement(db) {
  return db
    .prepare("UPDATE meta SET value = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE key = ?")
    .bind(KEY);
}

export async function getDataUpdatedAt(db) {
  const row = await db.prepare('SELECT value FROM meta WHERE key = ?').bind(KEY).first();
  return row ? row.value : null;
}
