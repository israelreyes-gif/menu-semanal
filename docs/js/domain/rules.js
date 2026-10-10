// Reglas de negocio: cuándo un día está completo, a medias o sin diseñar.
// Un "día" tiene la forma que devuelve la API:
// { mediamanana:{fruit}, comida:{free,veg,prot,carb}, merienda:{fruit}, cena:{free,veg,prot,carb} }

export const STATUS = {
  NONE: 'none', // sin punto
  PARTIAL: 'partial', // punto rosa
  COMPLETE: 'complete', // punto azul
};

// Fruta obligatoria en media mañana y merienda.
function fruitDone(slot) {
  return Boolean(slot && slot.fruit);
}

// Comida y cena: resuelta si es día libre o tiene verdura, proteína e hidrato.
function plateDone(slot) {
  if (!slot) return false;
  if (slot.free) return true;
  return Boolean(slot.veg && slot.prot && slot.carb);
}

function plateTouched(slot) {
  if (!slot) return false;
  return Boolean(slot.free || slot.veg || slot.prot || slot.carb);
}

export function dayStatus(day) {
  if (!day) return STATUS.NONE;

  const done = [
    fruitDone(day.mediamanana),
    plateDone(day.comida),
    fruitDone(day.merienda),
    plateDone(day.cena),
  ];

  if (done.every(Boolean)) return STATUS.COMPLETE;

  const touched =
    done.some(Boolean) || plateTouched(day.comida) || plateTouched(day.cena);

  return touched ? STATUS.PARTIAL : STATUS.NONE;
}
