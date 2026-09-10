function TitleHeader({title, dynamicClasses}) {
  return (
    <h2 className={`text-2xl font-bold mb-3 text-center md:text-left ${dynamicClasses}`}>{title} </h2>
  );
}

export default TitleHeader;