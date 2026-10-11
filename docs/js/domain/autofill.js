import { createDraft, toPayload } from './dayDraft.js';
import { fillDraft } from './suggest.js';

// Calcula qué huecos se rellenan en las fechas dadas, en orden, de modo que cada día
// tenga en cuenta lo ya rellenado en los anteriores.
// `days` son los días guardados de la semana. No guarda nada.
// Devuelve { updates: { fecha: cuerpoDelDía }, filled: nºDeHuecos }.
export function planAutofill(dates, foods, days) {
  const current = { ...days };
  const updates = {};
  let filled = 0;

  dates.forEach((date) => {
    const result = fillDraft(createDraft(current[date]), foods, date, current);
    if (result.filled === 0) return;

    const payload = toPayload(result.draft);
    current[date] = payload;
    updates[date] = payload;
    filled += result.filled;
  });

  return { updates, filled };
}
