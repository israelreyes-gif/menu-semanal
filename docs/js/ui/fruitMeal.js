import { renderOptionGroup } from './optionGroup.js';

// Tarjeta de Media mañana o Merienda (solo fruta).
// config: { title, fruits: [nombres], slot, onChange(slot) }
export function renderFruitMeal({ title, fruits, slot, onChange }) {
  const card = document.createElement('section');
  card.className = 'meal-card';

  const h = document.createElement('h3');
  h.textContent = title;

  const group = renderOptionGroup({
    label: 'Fruta',
    color: '#E8A5C8',
    options: fruits,
    selected: slot.fruit,
    onChange: (fruit) => onChange({ fruit }),
  });

  card.append(h, group);
  return card;
}
