export default function PersonalData({ employee }) {
  return (
     <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 rounded border-[#ffffff21] border">
        <div>
          <label className="font-semibold">Lugar de Nacimiento: </label>
            {employee.placeOfBirth}
        </div>

        <div>
          <label className="font-semibold">Nacionalidad: </label>
            {employee.nationality}
        </div>

        <div>
          <label className="font-semibold">Cédula: </label>
            {employee.ci}
        </div>

        <div>
          <label className="font-semibold">Edad: </label>
            {employee.age}
        </div>

        <div>
          <label className="font-semibold">Estado Civil: </label>
          {employee.maritalStatus}
        </div>
        <div>
          <label className="font-semibold">Tipo de Sangre: </label>
          {employee.bloodType}
        </div>
        <div>
          <label className="font-semibold">Teléfono Móvil: </label>
          {employee.mobilePhone}
        </div>
        <div>
          <label className="font-semibold">Teléfono Habitación: </label>
          {employee.homePhone}
        </div>
        <div className="md:col-span-2">
          <label className="font-semibold">Correo Electrónico: </label>
            {employee.email}
        </div>
        <div className="md:col-span-2">
          <label className="font-semibold">Dirección: </label>
          {employee.address}
        </div>
      </div>
  );
}
