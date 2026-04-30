function InputGeneric ({ readOnly, name, register, dinamicClasses }) {
  return (
    <input
      readOnly={readOnly}
      {...register(name)}
      className={`md:w-full px-1 py-1 rounded-lg filter-input ${dinamicClasses}`}
    />
  );
}

export default InputGeneric;
