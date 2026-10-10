// Dibuja una sección de alimentos (una categoría) con sus chips y el formulario de añadir.
// handlers: { onAdd(categoryId, name), onRemove(food) }

function chip(food, handlers) {
  const el = document.createElement('span');
  el.className = 'chip';

  const name = document.createElement('span');
  name.textContent = food.name;

  const btn = document.createElement('button');
  btn.className = 'chip-remove';
  btn.type = 'button';
  btn.textContent = '✕';
  btn.setAttribute('aria-label', `Quitar ${food.name}`);
  btn.addEventListener('click', () => handlers.onRemove(food));

  el.append(name, btn);
  return el;
}

function form(category, handlers) {
  const f = document.createElement('form');
  f.className = 'food-form';

  const input = document.createElement('input');
  input.type = 'text';
  input.maxLength = 60;
  input.placeholder = 'Añadir…';
  input.setAttribute('aria-label', `Añadir a ${category.label}`);

  const btn = document.createElement('button');
  btn.type = 'submit';
  btn.textContent = 'Añadir';

  f.append(input, btn);
  f.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = input.value.trim();
    if (name) handlers.onAdd(category.id, name);
  });
  return f;
}

export function renderFoodSection(category, foods, handlers) {
  const section = document.createElement('section');
  section.className = 'food-section';

  const title = document.createElement('h3');
  title.innerHTML = `<span class="dot" style="background:${category.color}"></span>`;
  title.append(category.label);

  const list = document.createElement('div');
  list.className = 'chips';
  if (foods.length === 0) {
    const empty = document.createElement('span');
    empty.className = 'muted';
    empty.textContent = 'Aún no hay alimentos.';
    list.append(empty);
  } else {
    foods.forEach((f) => list.append(chip(f, handlers)));
  }

  section.append(title, list, form(category, handlers));
  return section;
}
