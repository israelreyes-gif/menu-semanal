// Nombre de la caché de la app.
const CACHE_NAME = 'mi-plato-app';

// Entrada interna donde guardamos cuándo se creó la caché.
const META_URL = new URL('__cached_at__', self.registration.scope).href;

// Archivo cuya fecha de modificación pedimos al servidor.
const CHECK_URL = new URL('index.html', self.registration.scope).href;
