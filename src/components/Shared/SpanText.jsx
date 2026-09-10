function SpanText({ text = "Cargando...", dynamicClasses, centerElement = false }) {
  return (
    <div className={`${centerElement ? 'flex items-center justify-center min-h-[100px]' : ''} `}>
      <span className={`italic text-gray-500 ${dynamicClasses}`}>{text}</span>
    </div>
  );
}

export default SpanText;