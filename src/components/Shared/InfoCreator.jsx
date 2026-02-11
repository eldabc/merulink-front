function InfoCreator({createdBy}) {
return (
    <div className=" text-sm text-gray-200 italic">
      Evento creado por: <span className="font-medium text-[#9fd8ff]">{createdBy}</span>
    </div>
  );
}

export default InfoCreator;