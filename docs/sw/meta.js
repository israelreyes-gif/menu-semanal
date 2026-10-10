async function getCachedAt() {
  const cache = await caches.open(CACHE_NAME);
  const response = await cache.match(META_URL);
  if (!response) return null;
  const value = Number(await response.text());
  return Number.isFinite(value) ? value : null;
}

async function setCachedAt(timestamp) {
  const cache = await caches.open(CACHE_NAME);
  await cache.put(META_URL, new Response(String(timestamp)));
}

async function clearAppCache() {
  await caches.delete(CACHE_NAME);
}
