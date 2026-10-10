import { todayISO } from './domain/dates.js';

// Estado único de la app. Se cambia solo con setState y las pantallas se enteran por subscribe.
const state = {
  tab: 'semana', // 'semana' | 'calendario' | 'alimentos'
  selectedDate: todayISO(),
  editingDate: null, // fecha del día que se está editando, o null
};

const listeners = new Set();

export function getState() {
  return state;
}

export function setState(patch) {
  Object.assign(state, patch);
  listeners.forEach((fn) => fn(state));
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
