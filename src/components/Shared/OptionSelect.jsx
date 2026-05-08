function OptionSelect({ value = "", text }) {
  return (
    <option className="bg-[#3c4042]" value={value}> {text} </option>
  );
}

export default OptionSelect;