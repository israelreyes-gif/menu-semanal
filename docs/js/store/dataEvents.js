// Aviso de que los datos guardados han cambiado. Las pantallas que guardan copias en
// memoria se registran aquí para olvidarlas, sin depender unas de otras.

const listeners = new Set();

export function onDataChange(fn) {
  listeners.add(fn);
}

export function notifyDataChange() {
  listeners.forEach((fn) => fn());
}
