import { renderOptionGroup } from './optionGroup.js';

// Tarjeta de Comida o Cena: verdura, proteína e hidrato, o "Día libre".
// config: { title, foods: { veg, prot, carb } (listas de nombres), slot, onChange(slot) }
export function renderPlateMeal({ title, foods, slot, onChange }) {
  const card = document.createElement('section');
  card.className = 'meal-card';

  const head = document.createElement('div');
  head.className = 'meal-head';

  const h = document.createElement('h3');
  h.textContent = title;

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'free-toggle';
  if (slot.free) toggle.classList.add('is-on');
  toggle.setAttribute('role', 'switch');
  toggle.setAttribute('aria-checked', String(slot.free));
  toggle.textContent = 'Día libre';
  toggle.addEventListener('click', () => onChange({ ...slot, free: !slot.free }));

  head.append(h, toggle);
  card.append(head);

  if (slot.free) {
    const note = document.createElement('p');
    note.className = 'muted free-note';
    note.textContent = 'Sin menú en esta comida.';
    card.append(note);
    return card;
  }

  const groups = [
    { key: 'veg', label: 'Verdura', color: '#7FAEF0' },
    { key: 'prot', label: 'Proteína', color: '#F59BBE' },
    { key: 'carb', label: 'Hidrato', color: '#B9E1F4' },
  ];

  groups.forEach((g) => {
    card.append(
      renderOptionGroup({
        label: g.label,
        color: g.color,
        options: foods[g.key],
        selected: slot[g.key],
        onChange: (value) => onChange({ ...slot, [g.key]: value }),
      })
    );
  });

  return card;
}
