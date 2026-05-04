import ErrorMessage from "../Shared/ErrorMessage";

function InputGeneric ({ readOnly, name, register, dinamicClasses, errors, errorIndex }) {
  return (
    <div className="flex flex-col">
      <input
        readOnly={readOnly}
        {...register(name)}
        className={`md:w-full px-1 py-1 rounded-lg filter-input ${dinamicClasses}`}
      />
      {errorIndex?.message && <ErrorMessage msg={errorIndex?.message} />}
    </div>
  );
}

export default InputGeneric;
