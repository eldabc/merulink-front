function InfoCreator({creator}) {
return (
    <div className="text-sm text-gray-200 italic">
      Evento creado por: <span className="font-medium text-[#9fd8ff]">{creator}</span>
    </div>
  );
}

export default InfoCreator;