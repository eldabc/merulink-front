import { categoryEvents } from './../StaticData/typeEvent-utils';
import { fixedEvents } from '../StaticData/event-utils';

// Categorías para la leyenda
export const categoryLegend = [
  { key: ["meru-events"], label: "Eventos Merú", color: "meru-events" },
  { key: ["wedding-nights","dinner-heights"], label: "Noche de Bodas / Cena en Alturas", color: "di-heights-wedding-nights" },
  { key: ["ve-holidays","google-calendar"], label: "Festivos Venezolanos / Calendario Google", color: "g-calendar-ve-holidays" },
  { key: ["meru-birthdays"], label: "Cumpleaños Merú", color: "meru-birthdays" },
  { key: ["executive-mod"], label: "Ejecutivos MOD", color: "executive-mod" },  
  { key: ["banking-mondays"], label: "Lunes Bancarios", color: "banking-mondays" },
  
];

export const stringCategoryEvents = (keys) => {

  if (!Array.isArray(keys) || keys.length === 0) return "Sin Categoría";

  // Mapea las llaves con sus labels
  const labels = keys.map(key => {
    const category = categoryEvents.find(cat => cat.key === key);
    return category && category.label;
  });

  // Unir resultados
  return labels.join(' / ');
};

// Encontrar Eventos Fijos
export const findFixedEvents = (formData) => {
  const formDate = new Date(formData.startDate).toISOString().split("T")[0]
  const dayMonth = formDate.substring(5, 10); // Extrae "MM-DD"
    
  return fixedEvents.includes(dayMonth);
}