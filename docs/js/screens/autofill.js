import { saveDay } from '../api/planApi.js';
import { weekStart } from '../domain/dates.js';
import { planAutofill } from '../domain/autofill.js';
import { loadFoodNames } from '../store/foodsStore.js';
import { loadWeek, invalidateWeek } from '../store/planStore.js';
import { notifyDataChange } from '../store/dataEvents.js';
import { setState } from '../state.js';
import { showAlert } from '../ui/modal.js';

// Rellena los huecos de las fechas dadas (todas de la semana de `anchorDate`) y guarda.
// Con notify: true, avisa al terminar de cuántos huecos se han rellenado.
export async function autofillDays(dates, anchorDate, { notify = false } = {}) {
  const start = weekStart(anchorDate);

  try {
    const [foods, weekRes] = await Promise.all([loadFoodNames(), loadWeek(start)]);
    const { updates, filled } = planAutofill(dates, foods, weekRes.data.days);
    const entries = Object.entries(updates);

    if (entries.length === 0) {
      showAlert(
        'No hay huecos que rellenar, o faltan alimentos en la lista para los que están vacíos.',
        { title: 'Nada que rellenar' }
      );
      return;
    }

    const results = await Promise.allSettled(
      entries.map(([date, payload]) => saveDay(date, payload))
    );
    const failed = results.filter((r) => r.status === 'rejected').length;

    invalidateWeek(start);
    notifyDataChange();

    if (failed > 0) {
      showAlert(`No se pudieron guardar ${failed} de ${entries.length} días. Inténtalo de nuevo.`, {
        title: 'Autocompletar incompleto',
      });
    } else if (notify) {
      showAlert(`Se han rellenado ${filled} huecos en ${entries.length} días.`, {
        title: 'Semana autocompletada',
      });
    }
  } catch (err) {
    showAlert(err.message, { title: 'No se pudo autocompletar' });
  } finally {
    setState({}); // vuelve a pintar la pantalla actual con los datos nuevos
  }
}
