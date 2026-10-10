export const TABS = [
  { id: 'semana', label: 'Semana' },
  { id: 'calendario', label: 'Calendario' },
  { id: 'alimentos', label: 'Alimentos' },
];

// Dibuja la barra inferior. onSelect recibe el id de la pestaña pulsada.
export function renderNav(container, activeId, onSelect) {
  container.innerHTML = `
    <div class="tabbar">
      ${TABS.map(
        (t) => `
        <button class="tab ${t.id === activeId ? 'is-active' : ''}" data-tab="${t.id}">
          ${t.label}
        </button>`
      ).join('')}
    </div>`;

  container.querySelectorAll('.tab').forEach((btn) => {
    btn.addEventListener('click', () => onSelect(btn.dataset.tab));
  });
}
