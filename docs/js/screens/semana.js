import { longLabel } from '../domain/dates.js';
import { getState } from '../state.js';

export function renderSemana(container) {
  container.innerHTML = `
    <section class="placeholder">
      <h2>Semana</h2>
      <p>Aquí irá el menú de sábado a viernes.</p>
      <p class="muted">Día seleccionado: ${longLabel(getState().selectedDate)}</p>
    </section>`;
}
