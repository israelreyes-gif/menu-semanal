import { HttpError, badRequest } from './errors.js';

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    throw badRequest('El cuerpo debe ser JSON válido');
  }
}

export function errorResponse(err) {
  if (err instanceof HttpError) {
    return json({ error: err.message }, err.status);
  }
  console.error(err);
  return json({ error: 'Error interno del servidor' }, 500);
}

function corsHeaders(env) {
  return {
    'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

export function withCors(response, env) {
  for (const [name, value] of Object.entries(corsHeaders(env))) {
    response.headers.set(name, value);
  }
  return response;
}

export function preflight() {
  return new Response(null, { status: 204 });
}
