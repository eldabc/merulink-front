function Counter ({ number, dynamicClasses }) {
  return (
    <span className={`text-xs text-[#9fd8ff] bg-[#fffdfd21] px-2 py-0.5 rounded-full shrink-0 ${dynamicClasses}`}>
      {number}
    </span>
  );
}

export default Counter;