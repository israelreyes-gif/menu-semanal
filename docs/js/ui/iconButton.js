import { icon } from './icons.js';

// Botón con icono y texto. `text` es texto fijo de la app, nunca datos del usuario.
export function iconButton(iconName, text, className, onClick) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.innerHTML = `${icon(iconName)}<span>${text}</span>`;
  button.addEventListener('click', onClick);
  return button;
}
