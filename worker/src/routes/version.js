import { json } from '../http.js';
import { getDataUpdatedAt } from '../repos/metaRepo.js';

async function version({ env }) {
  return json({ dataUpdatedAt: await getDataUpdatedAt(env.DB) });
}

export const versionRoutes = [['GET', '/api/version', version]];
