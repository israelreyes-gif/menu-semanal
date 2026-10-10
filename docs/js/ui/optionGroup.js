// Grupo de opciones de elección única: tocar una la elige, tocarla otra vez la quita.
// config: { label, color, options: [nombres], selected, onChange(nuevoValor) }

export function renderOptionGroup({ label, color, options, selected, onChange }) {
  const wrap = document.createElement('div');
  wrap.className = 'opt-group';

  const title = document.createElement('div');
  title.className = 'opt-label';
  const dot = document.createElement('span');
  dot.className = 'dot';
  dot.style.background = color;
  title.append(dot, label);

  const chips = document.createElement('div');
  chips.className = 'opt-chips';

  // Si el alimento elegido ya no está en la lista, se muestra igualmente.
  const names = options.slice();
  if (selected && !names.includes(selected)) names.push(selected);

  if (names.length === 0) {
    const empty = document.createElement('span');
    empty.className = 'muted';
    empty.textContent = 'No hay alimentos. Añádelos en la pestaña Alimentos.';
    chips.append(empty);
  }

  names.forEach((name) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'opt-chip';
    btn.style.setProperty('--c', color);
    if (name === selected) btn.classList.add('is-selected');
    btn.textContent = name;
    btn.addEventListener('click', () => onChange(name === selected ? '' : name));
    chips.append(btn);
  });

  wrap.append(title, chips);
  return wrap;
}
