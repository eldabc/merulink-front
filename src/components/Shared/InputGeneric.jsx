import ErrorMessage from "../Shared/ErrorMessage";

function InputGeneric ({ readOnly, name, register, dinamicClasses, errorIndex, placeholder, onChange }) {
  return (
    <div className="flex flex-col">
      <input
        readOnly={readOnly}
        placeholder={placeholder}
        {...register(name, { onChange })}
        className={`md:w-full px-1 py-1 rounded-lg filter-input ${dinamicClasses}`}
      />
      {errorIndex?.message && <ErrorMessage msg={errorIndex?.message} />}
    </div>
  );
}

export default InputGeneric;
