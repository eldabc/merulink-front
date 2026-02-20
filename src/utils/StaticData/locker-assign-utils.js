export const lockerAssigns = [
  {
    id: 1,
    assignCode: 'ASG-D-03',
    assignDate: '2024-06-01',
    locker: {
      lockerId: 1,
      code: "D-01",
      status: 'Ocupado',
      category:{
        categoryId: 1,
        categoryKey: 'D',
        categoryName: 'Mujeres',
      },
      padlock: {
        id: 1,
        serial: 111155378,

        pass: '11-22-33',
        status: 'Asignado',
      }
    },
    employee: {
      employeeId: 1,
      employeeName: 'María Gómez',
      employeeSex: 'D',
      departmentId: 1,
      departmentName: 'Administración',
    },
  },
  {
    id: 2,
    assignCode: 'ASG-C-01',
    assignDate: '2024-06-01',
    locker: {
      lockerId: 1,
      code: "C-01",
      status: 'Ocupado',
      category:{
        categoryId: 1,
        categoryKey: 'C',
        categoryName: 'Caballeros',
      },
      padlock: {
        id: 2,
        serial: 222255378,

        pass: '11-22-33',
        status: 'Asignado',
      }
    },
    employee: {
      employeeId: 1,
      employeeName: 'José Gómez',
      employeeSex: 'C',
      departmentId: 1,
      departmentName: 'Administración',
    },
  },
  {
    id: 3,
    assignCode: 'ASG-C-03',
    assignDate: '2024-06-01',
    locker: {
      lockerId: 3,
      code: "C-03",
      status: 'Ocupado',
      category:{
        categoryId: 1,
        categoryKey: 'C',
        categoryName: 'Caballeros',
      },
      padlock: {
        id: 3,
        serial: 333355379,

        pass: '11-22-33',
        status: 'Asignado',
      }
    },
    employee: {
      employeeId: 1,
      employeeName: 'Pablo Gómez',
      employeeSex: 'C',
      departmentId: 1,
      departmentName: 'Administración',
    },
  },
   {
    id: 4,
    assignCode: 'ASG-C-04',
    assignDate: '2024-06-01',
    locker: {
      lockerId: 4,
      code: "C-04",
      status: 'Disponible',
      category:{
        categoryId: 1,
        categoryKey: 'C',
        categoryName: 'Caballeros',
      },
      // padlock: {
      //   id: 4,
      //   serial: 444455380,

      //   pass: '11-22-33',
      //   status: 'Asignado',
      // }
    },
    // employee: {
    //   employeeId: 1,
    //   employeeName: 'Manuel Gómez',
    //   employeeSex: 'C',
    //   departmentId: 1,
    //   departmentName: 'Administración',
    // },
  },
  // {
  //   id: 2,
  //   assignCode: 'ASG-D-04',
  //   categoryId: 2,
  //   lockerId: 4,
  //   employeeId: 2,
  //   assignDate: '2024-06-02',
  // },
  // {
  //   id: 3,
  //   assignCode: 'ASG-D-05',
  //   categoryId: 1,
  //   lockerId: 3,
  //   employeeId: 1,
  //   assignDate: '2024-06-01',
  // },
];