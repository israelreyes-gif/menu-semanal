function matchCached(request, ignoreSearch) {
  return caches
    .open(CACHE_NAME)
    .then((cache) => cache.match(request.url, { ignoreSearch }));
}

// 'reload' ignora la caché HTTP del navegador y pide el archivo al servidor.
async function fromNetwork(request) {
  const response = await fetch(request.url, { cache: 'reload' });
  if (response.ok) {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request.url, response.clone());
  }
  return response;
}

// Se ejecuta cada vez que se abre la app.
async function handleNavigation(request) {
  const verdict = await checkFreshness();
  if (verdict === 'stale') {
    await clearAppCache();
    await setCachedAt(Date.now());
  }

  const cached = await matchCached(request, true);
  if (cached) return cached;

  try {
    return await fromNetwork(request);
  } catch (err) {
    const fallback = await caches.match(CHECK_URL);
    if (fallback) return fallback;
    throw err;
  }
}

// Archivos sueltos (css, js, iconos): de la caché y, si no están, del servidor.
async function handleAsset(request) {
  const cached = await matchCached(request, false);
  return cached || fromNetwork(request);
}
