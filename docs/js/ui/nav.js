import { icon } from './icons.js';

export const TABS = [
  { id: 'hoy', label: 'Hoy', icon: 'sun' },
  { id: 'semana', label: 'Semana', icon: 'week' },
  { id: 'calendario', label: 'Calendario', icon: 'calendar' },
  { id: 'compra', label: 'Compra', icon: 'cart' },
  { id: 'alimentos', label: 'Alimentos', icon: 'bowl' },
];

// Dibuja la barra inferior. onSelect recibe el id de la pestaña pulsada.
export function renderNav(container, activeId, onSelect) {
  container.innerHTML = `
    <div class="tabbar">
      ${TABS.map(
        (t) => `
        <button class="tab ${t.id === activeId ? 'is-active' : ''}" data-tab="${t.id}">
          ${icon(t.icon)}
          <span>${t.label}</span>
        </button>`
      ).join('')}
    </div>`;

  container.querySelectorAll('.tab').forEach((btn) => {
    btn.addEventListener('click', () => onSelect(btn.dataset.tab));
  });
}
