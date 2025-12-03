// Datos de ejemplo
export const employees = [
  {
    id: 1,
    numEmployee: 'EMP001',
    ci: '12345678',
    name: 'Juan',
    lastName: 'Pérez',
    placeOfBirth: 'Caracas',
    nationality: 'Venezolana',
    age: 36,
    maritalStatus: 'Casado',
    bloodType: 'O+',
    email: 'juan.perez@example.com',
    mobilePhone: '0414-1234567',
    homePhone: '0212-9568741',
    address: 'Caracas, Los Ruices',
    joinDate: '2021-02-15',
    department: 'TI',
    subDepartment: 'Desarrollo',
    position: 'Desarrollador',
    status: true,
    useMeruLink: true,
    useHidCard: true,
    useLocker: false,
    useTransport: true,
    contacts: [
      {
        id: 1,
        name: 'María',
        lastName: 'Pérez',
        relationship: 'Esposa',
        phone: '0414-7654321',
        address: 'Caracas, Los Ruices'
      }
    ]
  },

  {
    id: 2,
    numEmployee: 'EMP002',
    ci: '87654321',
    name: 'María',
    lastName: 'García',
    placeOfBirth: 'Valencia',
    nationality: 'Venezolana',
    age: 32,
    maritalStatus: 'Soltera',
    bloodType: 'A+',
    email: 'maria.garcia@example.com',
    mobilePhone: '0424-8899001',
    homePhone: '0241-1239087',
    address: 'Valencia, Prebo',
    joinDate: '2020-08-10',
    department: 'RRHH',
    subDepartment: 'Nómina',
    position: 'Especialista',
    status: true,
    useMeruLink: false,
    useHidCard: true,
    useLocker: false,
    useTransport: false,
    contacts: [
      {
        id: 2,
        name: 'Rosa',
        lastName: 'García',
        relationship: 'Madre',
        phone: '0412-6677889',
        address: 'Valencia, Prebo'
      }
    ]
  },

  {
    id: 3,
    numEmployee: 'EMP003',
    ci: '11223344',
    name: 'Carlos',
    lastName: 'López',
    placeOfBirth: 'Maracay',
    nationality: 'Venezolana',
    age: 40,
    maritalStatus: 'Divorciado',
    bloodType: 'B+',
    email: 'carlos.lopez@example.com',
    mobilePhone: '0412-4433221',
    homePhone: '0243-9988110',
    address: 'Maracay, Las Delicias',
    joinDate: '2018-11-22',
    department: 'Ventas',
    subDepartment: 'Directa',
    position: 'Vendedor',
    status: false,
    useMeruLink: false,
    useHidCard: false,
    useLocker: false,
    useTransport: false,
    contacts: [
      {
        id: 3,
        name: 'Diego',
        lastName: 'López',
        relationship: 'Hermano',
        phone: '0414-5566778',
        address: 'Maracay, El Limón'
      }
    ]
  },

  {
    id: 4,
    numEmployee: 'EMP004',
    ci: '55667788',
    name: 'Ana',
    lastName: 'Martínez',
    placeOfBirth: 'Barquisimeto',
    nationality: 'Venezolana',
    age: 29,
    maritalStatus: 'Soltera',
    bloodType: 'AB+',
    email: 'ana.martinez@example.com',
    mobilePhone: '0416-1122334',
    homePhone: '0251-8899001',
    address: 'Barquisimeto, Centro',
    joinDate: '2022-05-03',
    department: 'TI',
    subDepartment: 'Infraestructura',
    position: 'Administrador',
    status: true,
    useMeruLink: true,
    useHidCard: true,
    useLocker: true,
    useTransport: true,
    contacts: [
      {
        id: 4,
        name: 'Luis',
        lastName: 'Martínez Ruiz',
        relationship: 'Padre',
        phone: '0426-3344556',
        address: 'Barquisimeto, Centro'
      }
    ]
  },

  {
    id: 5,
    numEmployee: 'EMP005',
    ci: '99887766',
    name: 'Pedro',
    lastName: 'Rodríguez',
    placeOfBirth: 'Caracas',
    nationality: 'Venezolana',
    age: 45,
    maritalStatus: 'Casado',
    bloodType: 'O-',
    email: 'pedro.rodriguez@example.com',
    mobilePhone: '0412-7788990',
    homePhone: '0212-4445566',
    address: 'Caracas, Chacao',
    joinDate: '2015-01-19',
    department: 'Finanzas',
    subDepartment: 'Contabilidad',
    position: 'Contador',
    status: true,
    useMeruLink: true,
    useHidCard: false,
    useLocker: false,
    useTransport: true,
    contacts: [
      {
        id: 5,
        name: 'Laura',
        lastName: 'Rodríguez Ruiz',
        relationship: 'Esposa',
        phone: '0416-9988776',
        address: 'Caracas, Chacao'
      }
    ]
  },

  {
    id: 6,
    numEmployee: 'EMP006',
    ci: '44332211',
    name: 'Laura',
    lastName: 'Fernández',
    placeOfBirth: 'Mérida',
    nationality: 'Venezolana',
    age: 27,
    maritalStatus: 'Soltera',
    bloodType: 'A-',
    email: 'laura.fernandez@example.com',
    mobilePhone: '0426-5544332',
    homePhone: '0274-7788990',
    address: 'Mérida, Campo Claro',
    joinDate: '2023-03-12',
    department: 'Marketing',
    subDepartment: 'Digital',
    position: 'Community Manager',
    status: true,
    useMeruLink: false,
    useHidCard: true,
    useLocker: false,
    useTransport: false,
    contacts: [
      {
        id: 6,
        name: 'Andrea',
        lastName: 'Ruiz Fernández',
        relationship: 'Hermana',
        phone: '0414-3344556',
        address: 'Mérida, Campo Claro'
      }
    ]
  },

  {
    id: 7,
    numEmployee: 'EMP007',
    ci: '22334455',
    name: 'Diego',
    lastName: 'Sánchez',
    placeOfBirth: 'Caracas',
    nationality: 'Venezolana',
    age: 23,
    maritalStatus: 'Soltero',
    bloodType: 'B-',
    email: 'diego.sanchez@example.com',
    mobilePhone: '0424-1122990',
    homePhone: '0212-9988112',
    address: 'Caracas, La California',
    joinDate: '2024-01-10',
    department: 'TI',
    subDepartment: 'Desarrollo',
    position: 'Junior Dev',
    status: true,
    useMeruLink: true,
    useHidCard: true,
    useLocker: false,
    useTransport: true,
    contacts: [
      {
        id: 7,
        name: 'Mónica',
        lastName: 'Sánchez Ruiz',
        relationship: 'Madre',
        phone: '0416-4433221',
        address: 'Caracas, La California'
      }
    ]
  },

  {
    id: 8,
    numEmployee: 'EMP008',
    ci: '66778899',
    name: 'Sofia',
    lastName: 'González',
    placeOfBirth: 'Valencia',
    nationality: 'Venezolana',
    age: 31,
    maritalStatus: 'Soltera',
    bloodType: 'O+',
    email: 'sofia.gonzalez@example.com',
    mobilePhone: '0414-6677889',
    homePhone: '0241-5566778',
    address: 'Valencia, Naguanagua',
    joinDate: '2020-09-28',
    department: 'RRHH',
    subDepartment: 'Selección',
    position: 'Recruiter',
    status: true,
    useMeruLink: false,
    useHidCard: false,
    useLocker: false,
    useTransport: false,
    contacts: [
      {
        id: 8,
        name: 'Daniel',
        lastName: 'González Ruiz',
        relationship: 'Hermano',
        phone: '0424-2211445',
        address: 'Valencia, Naguanagua'
      }
    ]
  },

  {
    id: 9,
    numEmployee: 'EMP009',
    ci: '33445566',
    name: 'Ricardo',
    lastName: 'Jiménez',
    placeOfBirth: 'Barinas',
    nationality: 'Venezolana',
    age: 42,
    maritalStatus: 'Casado',
    bloodType: 'AB-',
    email: 'ricardo.jimenez@example.com',
    mobilePhone: '0426-9088776',
    homePhone: '0273-5566334',
    address: 'Barinas, Alto Barinas',
    joinDate: '2017-10-03',
    department: 'Ventas',
    subDepartment: 'Indirecta',
    position: 'Gerente',
    status: true,
    useMeruLink: true,
    useHidCard: true,
    useLocker: true,
    useTransport: true,
    contacts: [
      {
        id: 9,
        name: 'Carolina ',
        lastName: 'Jiménez',
        relationship: 'Esposa',
        phone: '0412-8899775',
        address: 'Barinas, Alto Barinas'
      }
    ]
  },

  {
    id: 10,
    numEmployee: 'EMP010',
    ci: '77889900',
    name: 'Valentina',
    lastName: 'Morales',
    placeOfBirth: 'Puerto La Cruz',
    nationality: 'Venezolana',
    age: 28,
    maritalStatus: 'Soltera',
    bloodType: 'A+',
    email: 'valentina.morales@example.com',
    mobilePhone: '0426-1122443',
    homePhone: '0281-5566778',
    address: 'Puerto La Cruz, Lechería',
    joinDate: '2022-07-15',
    department: 'TI',
    subDepartment: 'Desarrollo',
    position: 'Frontend Dev',
    status: true,
    useMeruLink: true,
    useHidCard: true,
    useLocker: false,
    useTransport: true,
    contacts: [
      {
        id: 10,
        name: 'Sofía ',
        lastName: 'Morales',
        relationship: 'Hermana',
        phone: '0416-6677889',
        address: 'Lechería'
      }
    ]
  },

  {
    id: 11,
    numEmployee: 'EMP011',
    ci: '11223344',
    name: 'Miguel',
    lastName: 'Castro',
    placeOfBirth: 'Carúpano',
    nationality: 'Venezolana',
    age: 38,
    maritalStatus: 'Divorciado',
    bloodType: 'O+',
    email: 'miguel.castro@example.com',
    mobilePhone: '0414-3344221',
    homePhone: '0294-7788001',
    address: 'Carúpano, Centro',
    joinDate: '2016-06-09',
    department: 'Finanzas',
    subDepartment: 'Tesorería',
    position: 'Tesorero',
    status: false,
    useMeruLink: false,
    useHidCard: false,
    useLocker: false,
    useTransport: false,
    contacts: [
      {
        id: 11,
        name: 'Julio',
        lastName: 'Castro',
        relationship: 'Hermano',
        phone: '0412-4433661',
        address: 'Carúpano, Centro'
      }
    ]
  },

  {
    id: 12,
    numEmployee: 'EMP012',
    ci: '55667788',
    name: 'Gabriela',
    lastName: 'Ruiz',
    placeOfBirth: 'Maturín',
    nationality: 'Venezolana',
    age: 30,
    maritalStatus: 'Soltera',
    bloodType: 'B+',
    email: 'gabriela.ruiz@example.com',
    mobilePhone: '0424-9922883',
    homePhone: '0291-3355667',
    address: 'Maturín, Tipuro',
    joinDate: '2019-09-17',
    department: 'Marketing',
    subDepartment: 'Eventos',
    position: 'Coordinadora',
    status: true,
    useMeruLink: false,
    useHidCard: true,
    useLocker: true,
    useTransport: false,
    contacts: [
      {
        id: 12,
        name: 'Carla',
        lastName: 'Ruiz',
        relationship: 'Hermana',
        phone: '0416-1100992',
        address: 'Maturín, Tipuro'
      },
      {
        id: 13,
        name: 'Ana',
        lastName: 'Ruiz',
        relationship: 'Hermana',
        phone: '0416-6506992',
        address: 'Maturín, Tipuro'
      }
    ]
  }
];
