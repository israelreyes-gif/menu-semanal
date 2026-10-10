export default {
  async fetch(request, env) {
    const { results } = await env.DB
      .prepare('SELECT category, COUNT(*) AS total FROM foods GROUP BY category')
      .all();
    return Response.json({ ok: true, foods: results });
  },
};
