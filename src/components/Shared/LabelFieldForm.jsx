import RequiredMark from './RequiredMark';
function LabelFieldForm({ field, simbol, dynamicClasses }) {
  return (
    <div>
      <label className={`block text-lg font-medium text-gray-300 mt-1 ${dynamicClasses}`}>
        {field}: <RequiredMark simbol={simbol} />
      </label>
    </div>
  );
}

export default LabelFieldForm;