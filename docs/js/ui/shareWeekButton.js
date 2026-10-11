import { weekText } from '../domain/weekText.js';
import { shareText } from '../pwa/share.js';
import { showAlert } from './modal.js';
import { icon } from './icons.js';

// Botón "Compartir semana". Comparte el menú de la semana como texto.
export function renderShareWeekButton(start, days) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'btn-ghost';
  button.innerHTML = `${icon('share')}<span>Compartir semana</span>`;

  button.addEventListener('click', async () => {
    const result = await shareText('Menú semanal', weekText(start, days));
    if (result === 'copied') {
      showAlert('Este dispositivo no permite compartir, así que el menú se ha copiado.', {
        title: 'Menú copiado',
      });
    } else if (result === 'failed') {
      showAlert('No se pudo compartir ni copiar el menú.', { title: 'No se pudo compartir' });
    }
  });

  return button;
}
