import { todayISO, monthStart } from './domain/dates.js';

// Estado único de la app. Se cambia solo con setState y las pantallas se enteran por subscribe.
const state = {
  tab: 'hoy', // 'hoy' | 'semana' | 'calendario' | 'compra' | 'alimentos'
  selectedDate: todayISO(),
  calendarMonth: monthStart(todayISO()), // primer día del mes que se ve en el calendario
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
