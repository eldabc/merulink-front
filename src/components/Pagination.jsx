export default function Pagination({ paginatedData, startIndex, itemsPerPage, dataToDisplay, hasSearched, data, setCurrentPage, currentPage, totalPages, moduleName   }) {

  return (
    <div className="mt-6 flex items-center justify-between">
    <div className="text-sm text-white-600">
      Mostrando {paginatedData.length > 0 ? startIndex + 1 : 0} a {Math.min(startIndex + itemsPerPage, dataToDisplay.length)} de {dataToDisplay.length}
      <b>
        {hasSearched
          ? ` Resultados: ${dataToDisplay.length} ${moduleName}(s)`
          : ` Total: ${data.length} ${moduleName}s`
        }
      </b>
    </div>
    <div className="flex gap-2">
      <button
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
      Anterior
      </button>
      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-2 rounded-lg font-medium transition-colors ${
              currentPage === page
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-sky-200 hover:bg-gray-300'
            }`}
            >
            {page}
          </button>
        ))}
      </div>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
        Siguiente
        </button>
    </div>
    </div>
  );
}