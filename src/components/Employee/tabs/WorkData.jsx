export default function WorkData({ employee }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded border-[#ffffff21] border">
        <div>
        <label className="font-semibold">Fecha Ingreso: </label>
        {employee.joinDate}
        </div>

        <div>
        <label className="font-semibold">Departamento: </label>
        {employee.department}
        </div>

        <div>
        <label className="font-semibold">Sub-Departamento: </label>
        {employee.subDepartment}
        </div>

        <div>
        <label className="font-semibold">Cargo: </label>
        {employee.position}
        </div>

        <div className="flex items-center gap-4">
        <label className="font-semibold">Usa Meru Link?</label>
        <input type="checkbox" className="w-5 h-5" />
        </div>

        <div className="flex items-center gap-4">
        <label className="font-semibold">Usa Tarjeta HID?</label>
        <input type="checkbox" className="w-5 h-5" />
        </div>

        <div className="flex items-center gap-4">
        <label className="font-semibold">Usa Locker?</label>
        <input type="checkbox" className="w-5 h-5" />
        </div>

        <div className="flex items-center gap-4">
        <label className="font-semibold">Usa Transporte?</label>
        <input type="checkbox" className="w-5 h-5" />
        </div>
    </div>
  );
}
