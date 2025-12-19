// Categorías para la leyenda
export const categoryLegend = [
  { key: "meru-events", label: "Eventos Merú", color: "meru-events" },
  { key: "wedding-nights", label: "Plan Noche de Bodas", color: "wedding-nights" },
  // { key: "dinner-heights", label: "Cena en las Alturas", color: "dinner-heights" },
  { key: "venezuelan-holidays", label: "Festivos Venezolanos", color: "venezuelan-holidays" },
  { key: "google-calendar", label: "Calendario Google", color: "google-calendar" },
  { key: "meru-birthdays", label: "Cumpleaños Merú", color: "meru-birthdays" },
  { key: "executive-mod", label: "Ejecutivos MOD", color: "executive-mod" },  
  { key: "christian-holidays", label: "Festivos Cristianos", color: "christian-holidays" },
  
];

export const stringCategoryEvents = (eventCategory) => {
    return categoryLegend.find(cat => cat.key === eventCategory)?.label || 'Categoría Desconocida';
};