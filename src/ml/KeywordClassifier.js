// Clasificador provisional por palabras clave
export function classifyText(text = "") {
  const t = text.toLowerCase();

  const isRobo =
    /\brob(o|ar|aron|aronme|aron mi|o mi|ar mi|aron la|aron el)\b/.test(t) ||
    /\bcartera\b|\bcelular\b|\barma\b|\bme asaltaron\b|\basalto\b/.test(t);

  const isAcoso =
    /\bacos(o|ar|aron|o sexual)\b/.test(t) ||
    /\bme siguieron\b|\bme sigue\b|\bhostigamiento\b|\bmiradas lascivas\b/.test(t);

  const isVandalismo =
    /\bvandal(ismo|izaron)\b/.test(t) ||
    /\bgrafiti\b|\bpintaron\b|\brompieron\b|\bdañaron\b|\bvidrio\b/.test(t);

  if (isRobo) return "robo";
  if (isAcoso) return "acoso";
  if (isVandalismo) return "vandalismo";
  return "otro";
}
