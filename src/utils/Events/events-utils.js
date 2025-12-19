import { categoryLegend } from '../../utils/StaticData/typeEvent-utils';

export const stringCategoryEvents = (eventCategories) => {
  if (eventCategories.length > 1) {
    return "Noches de Bodas / Cena en Alturas";
  }
  
  const categoryKey = eventCategories[0];
  
  return categoryLegend.find(cat => cat.key === categoryKey)?.label ?? 'Categoría Desconocida';
};