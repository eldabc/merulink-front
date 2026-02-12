function LabelFieldForm({ field, simbol }) {
  return (
    <div>
      <label className="block text-lg font-medium text-gray-300 mt-1">{field}: {simbol}</label>
    </div>
  );
}

export default LabelFieldForm;