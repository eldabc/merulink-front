function RowTableLoading () {
  return (
    <tr className="w-full text-center bg-gray-600 rounded-2xl ">
      <td colSpan="4" className="justify-center mt-2 text-[14px] text-gray-50 text-shadow-amber-50 p-2">
        Cargando datos desde API...
      </td>
    </tr>
  );
}

export default RowTableLoading;