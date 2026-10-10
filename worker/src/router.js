import { methodNotAllowed, notFound } from './errors.js';
import { foodsRoutes } from './routes/foods.js';
import { planRoutes } from './routes/plan.js';
import { versionRoutes } from './routes/version.js';

function compile([method, pattern, handler]) {
  const keys = [];
  const source = pattern.replace(/:([A-Za-z]+)/g, (_, key) => {
    keys.push(key);
    return '([^/]+)';
  });
  return { method, regex: new RegExp(`^${source}$`), keys, handler };
}

const table = [...versionRoutes, ...foodsRoutes, ...planRoutes].map(compile);

export async function dispatch(request, env) {
  const url = new URL(request.url);
  let pathMatched = false;

  for (const route of table) {
    const match = url.pathname.match(route.regex);
    if (!match) continue;
    pathMatched = true;
    if (route.method !== request.method) continue;

    const params = {};
    route.keys.forEach((key, i) => {
      params[key] = decodeURIComponent(match[i + 1]);
    });
    return route.handler({ request, env, url, params });
  }

  throw pathMatched ? methodNotAllowed() : notFound('Ruta no encontrada');
}
