function SpanText({ text, dinamicClasses }) {
  return (
    <span className={`italic text-gray-500 ${dinamicClasses}`}>{text}</span>
  );
}

export default SpanText;