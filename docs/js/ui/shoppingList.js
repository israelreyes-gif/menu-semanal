import { FOOD_CATEGORIES } from '../domain/categories.js';

// Dibuja la lista de la compra: una tarjeta por categoría con "nombre ×veces".
export function renderShoppingList(list) {
  const wrap = document.createElement('div');
  wrap.className = 'shop-list';

  FOOD_CATEGORIES.forEach((cat) => {
    const items = list[cat.id] || [];
    if (items.length === 0) return;

    const section = document.createElement('section');
    section.className = 'food-section';

    const title = document.createElement('h3');
    title.innerHTML = `<span class="dot" style="background:${cat.color}"></span>`;
    title.append(cat.label);
    section.append(title);

    items.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'shop-item';

      const name = document.createElement('span');
      name.textContent = item.name;

      const count = document.createElement('span');
      count.className = 'shop-count';
      count.textContent = `×${item.count}`;

      row.append(name, count);
      section.append(row);
    });

    wrap.append(section);
  });

  return wrap;
}
