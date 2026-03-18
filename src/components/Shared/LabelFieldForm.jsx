function LabelFieldForm({ field, simbol, dinamicClasses }) {
  return (
    <div>
      <label className={`block text-lg font-medium text-gray-300 mt-1 ${dinamicClasses}`}>{field}: {simbol}</label>
    </div>
  );
}

export default LabelFieldForm;