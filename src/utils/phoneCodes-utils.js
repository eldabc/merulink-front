export const splitPhone = (fullNumber) => {
  if (!fullNumber) return { code: null, number: '' };
    const cleanedNumber = fullNumber ? String(fullNumber).replace(/[^0-9]/g, '') : '';
    const code = cleanedNumber.substring(0, 4); 
    const number = cleanedNumber.substring(4); 
  
    return { code, number };
};
export const phoneCodes = [
  {
    "id": 1,
    "areaCode": "0212",
    "city": "Caracas"
  },
  {
    "id": 2,
    "areaCode": "0241",
    "city": "Valencia (parte de Carabobo)"
  },
  {
    "id": 3,
    "areaCode": "0261",
    "city": "Maracaibo (Zulia)"
  },
  {
    "id": 4,
    "areaCode": "0273",
    "city": "San Cristóbal (Táchira)"
  },
  {
    "id": 5,
    "areaCode": "0251",
    "city": "Barquisimeto (Lara)"
  },
  {
    "id": 6,
    "areaCode": "0286",
    "city": "Ciudad Guayana (Bolívar)"
  },
  {
    "id": 7,
    "areaCode": "0295",
    "city": "Porlamar, Pampatar (Nueva Esparta)"
  },
  {
    "id": 8,
    "areaCode": "0281",
    "city": "Barcelona, Puerto La Cruz (Anzoátegui)"
  },
  {
    "id": 9,
    "areaCode": "0243",
    "city": "Maracay (Aragua)"
  },
  {
    "id": 10,
    "areaCode": "0274",
    "city": "Mérida (Mérida)"
  },
  {
    "id": 11,
    "areaCode": "0247",
    "city": "San Fernando de Apure (Apure)"
  },
  {
    "id": 12,
    "areaCode": "0255",
    "city": "Acarigua, Araure (Portuguesa)"
  },
  {
    "id": 13,
    "areaCode": "0268",
    "city": "Coro (Falcón)"
  },
  {
    "id": 14,
    "areaCode": "0291",
    "city": "Maturín (Monagas)"
  },
  {
    "id": 15,
    "areaCode": "0283",
    "city": "El Tigre (Anzoátegui)"
  },
  {
    "id": 16,
    "areaCode": "0285",
    "city": "Ciudad Bolívar (Bolívar)"
  },
  {
    "id": 17,
    "areaCode": "0293",
    "city": "Cumaná (Sucre)"
  },
  {
    "id": 18,
    "areaCode": "0257",
    "city": "San Felipe (Yaracuy)"
  },
  {
    "id": 19,
    "areaCode": "0258",
    "city": "San Carlos (Cojedes)"
  },
  {
    "id": 20,
    "areaCode": "0245",
    "city": "Guatire, Guarenas (Miranda)"
  }
];