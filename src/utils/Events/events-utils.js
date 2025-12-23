import { categoryEvents } from './../StaticData/typeEvent-utils';

// Categorías para la leyenda
export const categoryLegend = [
  { key: "meru-events", label: "Eventos Merú", color: "meru-events" },
  { key: "wedding-nights", label: "Noche de Bodas / Cena en Alturas", color: "wedding-nights" },
  { key: "dinner-heights", label: "Cena en las Alturas", color: "dinner-heights", itsMixedCategory: true },
  { key: "ve-holidays", label: "Festivos Venezolanos / Calendario Googlesdfsdf", color: "ve-holidays" },
  { key: "google-calendar", label: "Calendario Google", color: "google-calendar", itsMixedCategory: true },
  { key: "meru-birthdays", label: "Cumpleaños Merú", color: "meru-birthdays" },
  { key: "executive-mod", label: "Ejecutivos MOD", color: "executive-mod" },  
  { key: "christian-holidays", label: "Festivos Cristianos", color: "christian-holidays" },
  
];

export const stringCategoryEvents = (eventCategories) => {
  if (eventCategories.length > 1) {
    return "Noche de Bodas / Cena en Alturas";
  }
  
  const categoryKey = eventCategories[0];
  
  return categoryEvents.find(cat => cat.key === categoryKey)?.label ?? 'Categoría Desconocida';
};