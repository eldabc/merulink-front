// Estados de Venezuela: 23 estados + Distrito Capital.
// Se usan para el campo "Lugar de Nacimiento" cuando la nacionalidad es Venezolana.
export const venezuelaStates = [
  { id: 1, name: 'Amazonas' },
  { id: 2, name: 'Anzoátegui' },
  { id: 3, name: 'Apure' },
  { id: 4, name: 'Aragua' },
  { id: 5, name: 'Barinas' },
  { id: 6, name: 'Bolívar' },
  { id: 7, name: 'Carabobo' },
  { id: 8, name: 'Cojedes' },
  { id: 9, name: 'Delta Amacuro' },
  { id: 10, name: 'Distrito Capital' },
  { id: 11, name: 'Falcón' },
  { id: 12, name: 'Guárico' },
  { id: 13, name: 'La Guaira' },
  { id: 14, name: 'Lara' },
  { id: 15, name: 'Mérida' },
  { id: 16, name: 'Miranda' },
  { id: 17, name: 'Monagas' },
  { id: 18, name: 'Nueva Esparta' },
  { id: 19, name: 'Portuguesa' },
  { id: 20, name: 'Sucre' },
  { id: 21, name: 'Táchira' },
  { id: 22, name: 'Trujillo' },
  { id: 23, name: 'Yaracuy' },
  { id: 24, name: 'Zulia' },
];

// Normaliza texto: minúsculas, sin acentos y sin espacios sobrantes.
const normalize = (text = '') =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

/**
 * Busca un estado por nombre (insensible a mayúsculas/acentos).
 * @param {string} value
 * @returns {{id:number,name:string}|null}
 */
export function findVenezuelaState(value) {
  const target = normalize(value);
  if (!target) return null;
  return venezuelaStates.find((state) => normalize(state.name) === target) || null;
}
