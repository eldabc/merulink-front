function RowTableResults ({colSpan = 4, message}) {
  return (
    <tr className="border-b tr-table hover:bg-blue-50 transition-colors duration-150 cursor-pointer">
      <td className="p-4 text-gray-500 italic text-center" colSpan={colSpan}>{message}</td>
    </tr>
  );
}

export default RowTableResults;