export const lockerAssigns = [
  {
    id: 1,
    assignCode: 'ASG-D-03',
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
      id: 1,
      name: 'María Gómez',
      sex: 'M',
      departmentId: 1,
      departmentName: 'Administración',
    },
  },
  {
    id: 2,
    assignCode: 'ASG-C-01',
    assignDate: '2024-06-01',
    locker: {
      id: 1,
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
      name: 'José Gómez',
      sex: 'H',
      departmentId: 1,
      departmentName: 'Administración',
    },
  },
];