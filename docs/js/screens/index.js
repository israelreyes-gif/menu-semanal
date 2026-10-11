import { renderSemana } from './semana.js';
import { renderCalendario } from './calendario.js';
import { renderCompra } from './compra.js';
import { renderAlimentos } from './alimentos.js';

// Relaciona cada pestaña con la función que dibuja su pantalla.
export const SCREENS = {
  semana: renderSemana,
  calendario: renderCalendario,
  compra: renderCompra,
  alimentos: renderAlimentos,
};
