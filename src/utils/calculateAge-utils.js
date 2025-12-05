export const calculateAge = (watchedBirthDate, setValue) => {  
    if (!watchedBirthDate) {
      setValue('age', '');
      return;
    }
    const bd = new Date(watchedBirthDate);
    if (isNaN(bd.getTime())) {
      setValue('age', '');
      return;
    }
    const today = new Date();
    let edad = today.getFullYear() - bd.getFullYear();
    const m = today.getMonth() - bd.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) {
      edad--;
    }
    if (edad < 0) edad = 0;
    setValue('age', String(edad));
};