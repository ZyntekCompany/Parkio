// Función para formatear a pesos colombianos
export function formatToCOP(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0, // No mostrar decimales
    maximumFractionDigits: 0, // No mostrar decimales
  }).format(value);
}
