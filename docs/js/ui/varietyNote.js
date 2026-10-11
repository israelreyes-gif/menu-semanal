// Cuadro con los avisos de variedad. Devuelve null si no hay nada que avisar.
export function renderVarietyNote(notes) {
  if (notes.length === 0) return null;

  const box = document.createElement('section');
  box.className = 'variety-note';

  const title = document.createElement('strong');
  title.textContent = 'Variedad';

  const list = document.createElement('ul');
  notes.forEach((text) => {
    const item = document.createElement('li');
    item.textContent = text;
    list.append(item);
  });

  box.append(title, list);
  return box;
}
