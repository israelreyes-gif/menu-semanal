import { APP_NAME } from './config.js';
import { registerServiceWorker } from './pwa/registerSw.js';
import { todayISO, weekDates, longLabel } from './domain/dates.js';
import { dayStatus } from './domain/rules.js';

const screen = document.getElementById('screen');

function boot() {
  const hoy = todayISO();
  const semana = weekDates(hoy);

  const pruebas = [
    dayStatus(undefined),
    dayStatus({ mediamanana: { fruit: 'Manzana' } }),
    dayStatus({
      mediamanana: { fruit: 'Manzana' },
      comida: { free: true },
      merienda: { fruit: 'Pera' },
      cena: { veg: 'Brócoli', prot: 'Pollo', carb: 'Arroz' },
    }),
  ];

  screen.innerHTML = `
    <p>${APP_NAME} · hoy: ${longLabel(hoy)}</p>
    <p>Semana: ${semana.map((d) => d.slice(5)).join(' · ')}</p>
    <p>Estados: ${pruebas.join(', ')}</p>
  `;
}

registerServiceWorker();
boot();
