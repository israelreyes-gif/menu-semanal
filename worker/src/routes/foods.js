import { notFound } from '../errors.js';
import { json, readJson } from '../http.js';
import { addFood, listFoods, removeFood } from '../repos/foodsRepo.js';
import { getDataUpdatedAt } from '../repos/metaRepo.js';
import { groupFoods } from '../shapes/foods.js';
import { parseCategory, parseFoodName, parseId } from '../validators/food.js';

async function list({ env }) {
  const [rows, dataUpdatedAt] = await Promise.all([
    listFoods(env.DB),
    getDataUpdatedAt(env.DB),
  ]);
  return json({ foods: groupFoods(rows), dataUpdatedAt });
}

async function create({ request, env }) {
  const body = await readJson(request);
  const category = parseCategory(body?.category);
  const name = parseFoodName(body?.name);
  return json({ food: await addFood(env.DB, category, name) }, 201);
}

async function remove({ env, params }) {
  const id = parseId(params.id);
  if (!(await removeFood(env.DB, id))) throw notFound('El alimento no existe');
  return json({ deleted: id });
}

export const foodsRoutes = [
  ['GET', '/api/foods', list],
  ['POST', '/api/foods', create],
  ['DELETE', '/api/foods/:id', remove],
];
