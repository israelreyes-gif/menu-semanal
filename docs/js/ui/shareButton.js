import { shareText } from '../pwa/share.js';
import { showAlert } from './modal.js';
import { icon } from './icons.js';

// Botón de compartir con el mismo aspecto en toda la app.
// config: { label, title, getText } (getText se llama al pulsar, para compartir lo último)
export function renderShareButton({ label, title, getText }) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'share-btn is-secondary';
  button.innerHTML = `${icon('share')}<span>${label}</span>`;

  button.addEventListener('click', async () => {
    const result = await shareText(title, getText());
    if (result === 'copied') {
      showAlert('Este dispositivo no permite compartir, así que se ha copiado al portapapeles.', {
        title: 'Copiado',
      });
    } else if (result === 'failed') {
      showAlert('No se pudo compartir ni copiar.', { title: 'No se pudo compartir' });
    }
  });

  return button;
}
