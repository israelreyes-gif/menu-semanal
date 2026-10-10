import { STATUS } from '../domain/rules.js';

// Devuelve el elemento del punto de estado: azul (completo), rosa (a medias) o vacío.
export function statusDot(status) {
  const el = document.createElement('span');
  el.className = 'status-dot';
  if (status === STATUS.COMPLETE) {
    el.classList.add('is-complete');
    el.title = 'Día completo';
  } else if (status === STATUS.PARTIAL) {
    el.classList.add('is-partial');
    el.title = 'Día a medias';
  }
  return el;
}
