function SpanText({ text, dinamicClasses }) {
  return (
    <div className="flex items-center justify-center min-h-[100px]">
      <span className={`italic text-gray-500 ${dinamicClasses}`}>{text}</span>
    </div>
  );
}

export default SpanText;