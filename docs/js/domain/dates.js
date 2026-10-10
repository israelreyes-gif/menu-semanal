// Utilidades de fechas. Las fechas viajan como texto "YYYY-MM-DD" (hora local).
// La semana empieza en sábado y termina en viernes.

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

const pad = (n) => String(n).padStart(2, '0');

export function toISO(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// Se usa el mediodía para evitar problemas con cambios de hora.
export function parseISO(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0);
}

export function todayISO() {
  return toISO(new Date());
}

export function addDays(iso, n) {
  const d = parseISO(iso);
  d.setDate(d.getDate() + n);
  return toISO(d);
}

// Sábado de la semana a la que pertenece la fecha.
export function weekStart(iso) {
  const day = parseISO(iso).getDay(); // 0 = domingo ... 6 = sábado
  const back = (day + 1) % 7; // sábado → 0, domingo → 1, viernes → 6
  return addDays(iso, -back);
}

// Las 7 fechas de la semana (sábado a viernes).
export function weekDates(iso) {
  const start = weekStart(iso);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function dayName(iso) {
  return DIAS[parseISO(iso).getDay()];
}

export function dayNumber(iso) {
  return parseISO(iso).getDate();
}

export function monthName(iso) {
  return MESES[parseISO(iso).getMonth()];
}

// Ejemplo: "Sábado 10 de octubre"
export function longLabel(iso) {
  return `${dayName(iso)} ${dayNumber(iso)} de ${monthName(iso)}`;
}
