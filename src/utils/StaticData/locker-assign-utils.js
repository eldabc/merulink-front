export const lockerAssigns = [
  {
    id: 1,
    assignCode: 'ASG-D-01',
    assignDate: '2024-06-01',
    locker: {
      id: 1,
      code: "D-01",
      status: 'Ocupado',
      category:{
        id: 1,
        key: 'D',
        name: 'Damas',
      },
      padlock: {
        id: 1,
        serial: 111155378,
        pass: '11-22-33',
        status: 'Asignado',
      }
    },
    employee: {
      id: 4,
      name: 'Ana Martínez',
      sex: 'M',
      department: 4,
      departmentName: 'Alimentos y Bebidas',
    },
  },
  {
    id: 2,
    assignCode: 'ASG-C-01',
    assignDate: '2024-06-01',
    locker: {
      id: 9,
      code: "C-01",
      status: 'Ocupado',
      category:{
        id: 2,
        key: 'C',
        name: 'Caballeros',
      },
      padlock: {
        id: 2,
        serial: 22245672,
        pass: '44-55-66',
        status: 'Disponible',
      }
    },
    employee: {
      id: 1,
      name: 'Juan Pérez',
      sex: 'H',
      department: 1,
      departmentName: 'Administración',
    },
  },
  {
    id: 3,
    assignCode: 'ASG-D-03',
    assignDate: '2024-06-02',
    locker: {
      id: 3,
      code: "D-03",
      status: 'Emparejado',
      category:{
        id: 1,
        key: 'D',
        name: 'Damas',
      },
      padlock: {
        id: 3,
        serial: 333456323,
        pass: '77-88-99',
        status: 'Asignado',
      },  
    },
    employee: null,
  },
  {
    id: 4,
    assignCode: 'ASG-C-02',
    assignDate: '2024-06-01',
    locker: {
      id: 2,
      code: "C-02",
      status: 'Emparejado',
      category:{
        id: 2,
        key: 'C',
        name: 'Caballeros',
      },
      padlock: {
        id: 5,
        serial: 555545678,
        pass: '33-44-55',
        status: 'Asignado',
      },
    },
    employee: null,
  },
  {
    id: 5,
    assignCode: 'ASG-C-05',
    assignDate: '2024-06-01',
    locker: {
      id: 5,
      code: "C-05",
      status: 'Emparejado',
      category:{
        id: 2,
        key: 'C',
        name: 'Caballeros',
      },
      padlock: {
        id: 4,
        serial: 444733328,
        pass: '00-11-22',
        status: 'Asignado',
      },
    },
    employee: null,
  },
];