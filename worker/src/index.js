import { errorResponse, preflight, withCors } from './http.js';
import { dispatch } from './router.js';

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return withCors(preflight(), env);
    try {
      return withCors(await dispatch(request, env), env);
    } catch (err) {
      return withCors(errorResponse(err), env);
    }
  },
};
