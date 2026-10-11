import { dayStatus, STATUS } from '../domain/rules.js';
import { iconButton } from './iconButton.js';

// Fila de botones de un día: Diseñar o Editar, y Rellenar (si le faltan huecos).
// onEdit y onFill reciben la fecha.
export function renderDayActions(date, day, onEdit, onFill) {
  const status = dayStatus(day);

  const row = document.createElement('div');
  row.className = 'detail-actions';

  row.append(
    iconButton('pencil', status === STATUS.NONE ? 'Diseñar' : 'Editar', 'edit-btn', () =>
      onEdit(date)
    )
  );

  if (status !== STATUS.COMPLETE) {
    const fill = iconButton('sparkles', 'Rellenar', 'soft-btn', async () => {
      fill.disabled = true;
      await onFill(date);
    });
    row.append(fill);
  }

  return row;
}
