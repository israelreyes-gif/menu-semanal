// Devuelve 'fresh' (usar caché), 'stale' (descargar de nuevo)
// o 'unknown' (sin conexión: usar la caché que haya).
async function checkFreshness() {
  const cachedAt = await getCachedAt();
  if (cachedAt === null) return 'stale';

  let response;
  try {
    response = await fetch(CHECK_URL, { method: 'HEAD', cache: 'no-store' });
  } catch (err) {
    return 'unknown';
  }
  if (!response.ok) return 'unknown';

  const serverModified = Date.parse(response.headers.get('last-modified') || '');
  if (Number.isNaN(serverModified)) return 'stale';

  return cachedAt > serverModified ? 'fresh' : 'stale';
}
