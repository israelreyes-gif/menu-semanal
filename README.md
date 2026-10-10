# Mi Plato

PWA para diseñar el menú semanal (sábado mañana a viernes cena).
Plato: ½ verdura, ¼ proteína, ¼ hidratos. Media mañana y merienda con fruta obligatoria.
Comida y cena pueden marcarse como "Día libre".

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
  sw.js                 service worker
  css/                  base, layout, componentes, pantallas
  js/
    main.js             arranque
    config.js           URL de la API y constantes
    state.js            estado de la app
    api/                cliente HTTP y llamadas a la API
    domain/             fechas y reglas (día completo / a medias)
    cache/              comprobación de frescura de la caché
    ui/                 piezas reutilizables
    screens/            semana, calendario, alimentos, editor del día
```

## Reglas del proyecto

- Cada archivo tiene una sola responsabilidad.
- Archivos cortos: si pasa de unas 150 líneas, se divide.
- Sin Node ni bundler: la PWA usa módulos ES nativos.
- La API se despliega desde GitHub (Workers Builds), sin CLI.
