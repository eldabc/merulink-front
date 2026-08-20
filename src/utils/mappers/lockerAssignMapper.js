import dayjs from 'dayjs';

export const mapLockerAssignToBackend = (formData) => { 

  const wasAssigned = formData.employee.id;
  const today = dayjs().format('YYYY-MM-DD');
  const todayLabel = dayjs().format('DD-MM-YYYY');

  const employeeDataSet = wasAssigned ? (
    {
      id: formData.employee.id,
    }
  ) : null;

  return {
    id: formData.id ? formData.id : Date.now(),
    assign_code: wasAssigned ? `ASG${formData.locker?.code}-${todayLabel}` : '',
    assign_date: wasAssigned ? today : '',
    locker: {
      id: formData.locker?.id,
      code: formData.locker?.code,
      status: wasAssigned ? 'Ocupado' : 'Emparejado',
      category:{
        id: formData.locker?.category?.id,
        key: formData.locker?.category?.key,
        name: formData.locker?.category?.name,
      },
      padlock: {
        ...formData.padlock,
        status: 'Asignado',
      }
    },
    employee: employeeDataSet
  };
};