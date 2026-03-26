export const newNumEmployee = (employeeData) => {
  // generar número de empleado automáticamente
  const maxNum = Math.max( 0,
    ...employeeData.map(e => {
      const num = parseInt(e.numEmployee) || 0;
      return num;
    })
  );
  return String(maxNum + 1);
}