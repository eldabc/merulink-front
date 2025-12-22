// import { categoryLegend } from '../../utils/StaticData/typeEvent-utils';

// Categorías para la leyenda
export const categoryLegend = [
  { key: "meru-events", label: "Eventos Merú", color: "meru-events" },
  { key: "wedding-nights", label: "Noches de Bodas / Cena en Alturas", color: "wedding-nights" },
  // { key: "dinner-heights", label: "Cena en las Alturas", color: "dinner-heights" },
  { key: "ve-holidays", label: "Festivos Venezolanos / Calendario Google", color: "ve-holidays" },
  // { key: "google-calendar", label: "Calendario Google", color: "google-calendar" },
  { key: "meru-birthdays", label: "Cumpleaños Merú", color: "meru-birthdays" },
  { key: "executive-mod", label: "Ejecutivos MOD", color: "executive-mod" },  
  { key: "christian-holidays", label: "Festivos Cristianos", color: "christian-holidays" },
  
];

export const stringCategoryEvents = (eventCategories) => {
  if (eventCategories.length > 1) {
    return "Noches de Bodas / Cena en Alturas";
  }
  
  const categoryKey = eventCategories[0];
  
  return categoryLegend.find(cat => cat.key === categoryKey)?.label ?? 'Categoría Desconocida';
};