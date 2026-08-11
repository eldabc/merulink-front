function SpanText({ text = "Cargando...", dinamicClasses, centerElement = false }) {
  return (
    <div className={`${centerElement ? 'flex items-center justify-center min-h-[100px]' : ''} `}>
      <span className={`italic text-gray-500 ${dinamicClasses}`}>{text}</span>
    </div>
  );
}

export default SpanText;