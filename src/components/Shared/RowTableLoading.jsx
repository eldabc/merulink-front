function RowTableLoading ({colSpan = 4}) {
  return (
    <tr className="w-full text-center bg-gray-600">
      <td colSpan={colSpan} className="justify-center mt-2 text-[14px] text-gray-50 text-shadow-amber-50 p-2">
        Cargando datos desde API...
      </td>
    </tr>
  );
}

export default RowTableLoading;