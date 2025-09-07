const RESPONSES = {
  robo:
    "🚨 Reporte clasificado como *robo*. Llama a seguridad universitaria y, si aplica, al 911. Indica ubicación, hora y descripción. ¿Deseas que notifique al personal?",
  acoso:
    "🙏 Reporte clasificado como *acoso*. Te sugiero contactar a la unidad de atención y seguridad. ¿Deseas que te comparta números de apoyo?",
  vandalismo:
    "🛠️ Reporte clasificado como *vandalismo*. Gracias por informar. ¿Quieres adjuntar una foto o ubicación para mantenimiento?",
  otro:
    "📋 Reporte clasificado como *otro*. Gracias por informar. ¿Deseas categorizarlo manualmente o agregar más detalles?"
};

export function botReply(category) {
  return RESPONSES[category] || RESPONSES.otro;
}
