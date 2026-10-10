// Ventanas modales de la app: avisos y confirmaciones con el mismo aspecto en todas las pantallas.

function openModal({ title, message, buttons }) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    const box = document.createElement('div');
    box.className = 'modal';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');

    const h = document.createElement('h2');
    h.className = 'modal-title';
    h.textContent = title;

    const p = document.createElement('p');
    p.className = 'modal-text';
    p.textContent = message;

    const actions = document.createElement('div');
    actions.className = 'modal-actions';

    function close(value) {
      document.removeEventListener('keydown', onKey);
      overlay.remove();
      resolve(value);
    }

    function onKey(e) {
      if (e.key === 'Escape') close(false);
    }

    let primaryBtn = null;
    buttons.forEach((b) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `modal-btn ${b.primary ? 'is-primary' : 'is-secondary'}`;
      btn.textContent = b.label;
      btn.addEventListener('click', () => close(b.value));
      if (b.primary) primaryBtn = btn;
      actions.append(btn);
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close(false);
    });
    document.addEventListener('keydown', onKey);

    box.append(h, p, actions);
    overlay.append(box);
    document.body.append(overlay);
    if (primaryBtn) primaryBtn.focus();
  });
}

// Aviso con un solo botón.
export function showAlert(message, { title = 'Aviso', okLabel = 'Entendido' } = {}) {
  return openModal({
    title,
    message,
    buttons: [{ label: okLabel, value: true, primary: true }],
  }).then(() => undefined);
}

// Confirmación: devuelve true si acepta y false si cancela.
export function showConfirm(
  message,
  { title = 'Confirmar', okLabel = 'Aceptar', cancelLabel = 'Cancelar' } = {}
) {
  return openModal({
    title,
    message,
    buttons: [
      { label: cancelLabel, value: false, primary: false },
      { label: okLabel, value: true, primary: true },
    ],
  });
}
