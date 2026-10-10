# Mi Plato

PWA para diseñar el menú semanal (sábado mañana a viernes cena).
Plato: ½ verdura, ¼ proteína, ¼ hidratos. Media mañana y merienda con fruta obligatoria.
Comida y cena pueden marcarse como "Día libre".

## Arquitectura

```
iPhone (PWA en GitHub Pages)
   └─► Proxy en Netlify (sale fuera de España, evita el bloqueo de LaLiga)
          └─► Worker en Cloudflare ──► D1 (SQLite)
```

## Estructura

```
worker/                 API en Cloudflare Workers (la base de datos vive en D1)
  wrangler.jsonc        configuración y enlace con D1
  src/
    index.js            punto de entrada
    router.js           enrutado de peticiones
    constants.js        categorías y comidas
    errors.js           errores HTTP
    http.js             respuestas JSON y CORS
    validators/         validación de fechas, alimentos y días
    shapes/             formato de salida de los datos
    repos/              consultas a D1
    routes/             un archivo por recurso (version, foods, plan)
docs/                   PWA (GitHub Pages sirve esta carpeta)
  index.html
  manifest.webmanifest
  sw.js                 service worker (carga los archivos de sw/)
  sw/                   configuración, fecha de caché, frescura y estrategias
  icons/                icono SVG y PNG (pantalla de inicio de iOS)
  css/                  base, layout, nav, foods, modal, week, editor, calendar
  js/
    main.js             arranque
    app.js              pinta la pestaña activa o el editor
    config.js           URL de la API y constantes
    state.js            estado de la app
    api/                cliente HTTP y llamadas a la API
    domain/             fechas, reglas (día completo / a medias), resúmenes, borrador del día
    store/              caché local de datos y almacenamiento seguro
    pwa/                registro del service worker y bloqueo de zoom
    ui/                 piezas reutilizables (barra, chips, modal, filas, cuadrícula…)
    screens/            semana, calendario, alimentos, editor del día
```

## Caché

- **App (service worker):** en cada acceso se compara la fecha de la caché con la
  `Last-Modified` del servidor. Si la caché es posterior, se usa; si es anterior, se descarga de nuevo.
- **Datos (localStorage):** en cada carga se pregunta a `/api/version` por la fecha de la última
  modificación. Si la copia local es igual o posterior, se usa; si es anterior, se vuelve a pedir.
  Sin conexión se usa la copia local.

## Reglas del proyecto

- Cada archivo tiene una sola responsabilidad.
- Archivos cortos: si pasa de unas 150 líneas, se divide.
- Sin Node ni bundler: la PWA usa módulos ES nativos.
- La API se despliega desde GitHub (Workers Builds), sin CLI.
- Los avisos y confirmaciones usan siempre `ui/modal.js`, nunca `alert` ni `confirm`.
