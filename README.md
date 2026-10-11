# Mi Plato

PWA para diseñar el menú semanal (sábado mañana a viernes cena).
Plato: ½ verdura, ¼ proteína, ¼ hidratos. Media mañana y merienda con fruta obligatoria.
Comida y cena pueden marcarse como "Día libre".

## Pantallas

- **Hoy:** las cuatro comidas de hoy, con la que toca ahora marcada. Es la pantalla de inicio.
  Permite diseñar o editar el día y rellenarlo automáticamente.
- **Semana:** los 7 días (sábado a viernes) en una línea, con su punto de estado y el resumen
  del día seleccionado. Permite diseñar, editar o rellenar un día, autocompletar la semana
  entera y compartir el menú como texto.
- **Calendario:** vista mensual (lunes a domingo) con los puntos de estado. Es de solo lectura:
  al tocar un día se ve su menú, pero no se edita aquí.
- **Compra:** lista de la compra de la semana, con cantidades, que se puede compartir.
- **Alimentos:** gestión de verduras, proteínas, hidratos y frutas.
- **Editor del día:** se abre desde Hoy o Semana para diseñar o editar un día. Incluye
  "Rellenar huecos", que completa solo lo que falta.

Punto azul: día completo. Punto rosa: día a medias. Sin punto: sin diseñar.

## Variedad y sugerencias

- **Aviso de repetición:** si un alimento llega a 3 apariciones en la misma semana, sale un
  aviso en un modal. Los días libres no cuentan.
- **Rellenar y autocompletar:** las sugerencias eligen los alimentos menos usados de la semana.
  "Rellenar" completa un día y lo guarda directamente; "Autocompletar semana" lo hace con todos
  los días incompletos, previa confirmación.

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
  css/                  base, layout, nav, foods, modal, week, editor, calendar,
                        buttons, today
  js/
    main.js             arranque
    app.js              pinta la pestaña activa o el editor
    config.js           URL de la API y constantes
    state.js            estado de la app (pestaña, día, mes, día en edición)
    api/                cliente HTTP y llamadas a la API
    domain/             fechas, reglas de estado, resúmenes, borrador del día,
                        categorías, comida actual, lista de la compra, textos
                        para compartir, variedad (variety), sugerencias (suggest)
                        y autocompletado (autofill)
    store/              caché local de datos, almacenamiento seguro, alimentos
                        (foodsStore) y eventos de cambio de datos (dataEvents)
    pwa/                registro del service worker, bloqueo de zoom y compartir
    ui/                 piezas reutilizables (barra, iconos, chips, modal, filas,
                        cuadrícula, tarjetas de hoy, lista de la compra, botón
                        de compartir, botones con icono, acciones del día y
                        detalle del día…)
    screens/            hoy, semana, calendario, compra, alimentos, editor del día
                        y autofill (rellenar días)
```

## Caché

- **App (service worker):** en cada acceso se compara la fecha de la caché con la
  `Last-Modified` del servidor. Si la caché es posterior, se usa; si es anterior, se descarga de nuevo.
- **Datos (localStorage):** en cada carga se pregunta a `/api/version` por la fecha de la última
  modificación. Si la copia local es igual o posterior, se usa; si es anterior, se vuelve a pedir.
  Sin conexión se usa la copia local.
- Al guardar, borrar o autocompletar, las pantallas olvidan su copia en memoria mediante
  `store/dataEvents.js`, para no mostrar datos viejos.

## Reglas del proyecto

- Cada archivo tiene una sola responsabilidad.
- Archivos cortos: si pasa de unas 150 líneas, se divide.
- Sin Node ni bundler: la PWA usa módulos ES nativos.
- La API se despliega desde GitHub (Workers Builds), sin CLI.
- Los avisos y confirmaciones usan siempre `ui/modal.js`, nunca `alert` ni `confirm`.
- Los iconos salen de `ui/icons.js`.
- Compartir usa siempre `ui/shareButton.js`, para que el botón sea igual en todas las pantallas.
- La edición de días solo se hace desde Hoy y Semana; Calendario es de solo lectura.
