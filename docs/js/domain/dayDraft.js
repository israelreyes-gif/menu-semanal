// Borrador de un día: copia editable con todos los campos presentes.

const text = (v) => (typeof v === 'string' ? v : '');

function fruitSlot(s) {
  return { fruit: text((s || {}).fruit) };
}

function plateSlot(s) {
  const src = s || {};
  return {
    free: src.free === true,
    veg: text(src.veg),
    prot: text(src.prot),
    carb: text(src.carb),
  };
}

// Crea el borrador a partir del día que devuelve la API (o undefined si no existe).
export function createDraft(day) {
  const d = day || {};
  return {
    mediamanana: fruitSlot(d.mediamanana),
    comida: plateSlot(d.comida),
    merienda: fruitSlot(d.merienda),
    cena: plateSlot(d.cena),
  };
}

// Si una comida es "Día libre", se descarta lo que hubiera elegido.
function cleanPlate(slot) {
  if (slot.free) return { free: true, veg: '', prot: '', carb: '' };
  return { free: false, veg: slot.veg, prot: slot.prot, carb: slot.carb };
}

// Cuerpo que se envía a la API.
export function toPayload(draft) {
  return {
    mediamanana: { fruit: draft.mediamanana.fruit },
    comida: cleanPlate(draft.comida),
    merienda: { fruit: draft.merienda.fruit },
    cena: cleanPlate(draft.cena),
  };
}
