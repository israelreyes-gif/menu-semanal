// Bloquea el zoom por pellizco y por doble toque, que iOS a veces permite aunque el CSS lo prohíba.

function prevent(e) {
  e.preventDefault();
}

export function lockGestures() {
  // Gestos de pellizco propios de iOS Safari.
  document.addEventListener('gesturestart', prevent);
  document.addEventListener('gesturechange', prevent);
  document.addEventListener('gestureend', prevent);

  // Cualquier movimiento con dos o más dedos.
  document.addEventListener(
    'touchmove',
    (e) => {
      if (e.touches.length > 1) e.preventDefault();
    },
    { passive: false }
  );

  // Doble toque rápido (zoom).
  let lastTouchEnd = 0;
  document.addEventListener(
    'touchend',
    (e) => {
      const now = Date.now();
      if (now - lastTouchEnd < 300) e.preventDefault();
      lastTouchEnd = now;
    },
    { passive: false }
  );
}
