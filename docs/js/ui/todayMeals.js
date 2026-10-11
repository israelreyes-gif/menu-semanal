import { MEAL_ORDER, MEAL_LABELS } from '../domain/summary.js';

const KINDS = {
  veg: { label: 'Verdura', color: '#7FAEF0' },
  prot: { label: 'Proteína', color: '#F59BBE' },
  carb: { label: 'Hidrato', color: '#B9E1F4' },
  fruit: { label: 'Fruta', color: '#E8A5C8' },
};

function row(kind, value) {
  const { label, color } = KINDS[kind];

  const el = document.createElement('div');
  el.className = 'today-row';

  const dot = document.createElement('span');
  dot.className = 'dot';
  dot.style.background = color;

  const name = document.createElement('span');
  name.className = 'today-label';
  name.textContent = label;

  const text = document.createElement('span');
  text.className = 'today-value';
  if (value) {
    text.textContent = value;
  } else {
    text.textContent = 'Sin elegir';
    text.classList.add('is-empty');
  }

  el.append(dot, name, text);
  return el;
}

function card(meal, slot, isNow) {
  const el = document.createElement('section');
  el.className = 'today-card';
  if (isNow) el.classList.add('is-now');

  const head = document.createElement('div');
  head.className = 'today-card-head';
  const title = document.createElement('h3');
  title.textContent = MEAL_LABELS[meal];
  head.append(title);

  if (isNow) {
    const badge = document.createElement('span');
    badge.className = 'now-badge';
    badge.textContent = 'Ahora';
    head.append(badge);
  }
  el.append(head);

  const data = slot || {};
  const isFruitMeal = meal === 'mediamanana' || meal === 'merienda';

  if (isFruitMeal) {
    el.append(row('fruit', data.fruit));
  } else if (data.free) {
    const free = document.createElement('p');
    free.className = 'today-free';
    free.textContent = 'Día libre';
    el.append(free);
  } else {
    el.append(row('veg', data.veg), row('prot', data.prot), row('carb', data.carb));
  }

  return el;
}

// Tarjetas de las cuatro comidas del día. `current` es la comida que toca ahora.
export function renderTodayMeals(day, current) {
  const wrap = document.createElement('div');
  wrap.className = 'today-list';
  MEAL_ORDER.forEach((meal) => {
    wrap.append(card(meal, day && day[meal], meal === current));
  });
  return wrap;
}
