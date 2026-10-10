// Acceso seguro a localStorage: si falla (modo privado, bloqueado...), la app sigue funcionando.
const PREFIX = 'miplato:';

export function readJson(key) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeJson(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Sin espacio o sin permiso: simplemente no se guarda.
  }
}

export function removeKey(key) {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    // Nada que hacer.
  }
}
