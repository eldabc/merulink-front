function InputEmail ({ readOnly, register, disabledClasses }) {
  return (
    <input readOnly={readOnly} {...register('email')} style={{ textTransform: 'lowercase' }} className={`w-full px-3 py-2 rounded-lg filter-input ${disabledClasses}`} />
  );
}

export default InputEmail;