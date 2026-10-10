import { json, readJson } from '../http.js';
import { getDataUpdatedAt } from '../repos/metaRepo.js';
import { deleteDay, listDays, saveDay } from '../repos/planRepo.js';
import { groupDays } from '../shapes/days.js';
import { parseDate, parseRange } from '../validators/date.js';
import { isEmptyDay, parseDay } from '../validators/day.js';

async function list({ env, url }) {
  const { from, to } = parseRange(
    url.searchParams.get('from'),
    url.searchParams.get('to')
  );
  const [rows, dataUpdatedAt] = await Promise.all([
    listDays(env.DB, from, to),
    getDataUpdatedAt(env.DB),
  ]);
  return json({ days: groupDays(rows), dataUpdatedAt });
}

async function save({ request, env, params }) {
  const date = parseDate(params.date);
  const rows = parseDay(await readJson(request));
  if (isEmptyDay(rows)) {
    await deleteDay(env.DB, date);
  } else {
    await saveDay(env.DB, date, rows);
  }
  const days = groupDays(await listDays(env.DB, date, date));
  return json({ date, day: days[date] ?? null });
}

async function remove({ env, params }) {
  const date = parseDate(params.date);
  await deleteDay(env.DB, date);
  return json({ date, day: null });
}

export const planRoutes = [
  ['GET', '/api/plan', list],
  ['PUT', '/api/plan/:date', save],
  ['DELETE', '/api/plan/:date', remove],
];
