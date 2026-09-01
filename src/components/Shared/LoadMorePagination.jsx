/**
 * Controles reutilizables para listados con "Ver más" + paginación scroll vertical.
 *
 * Combina el botón "Ver más" con la paginación clásica (Anterior / números / Siguiente).
 * Al hacer clic en un número, el hook (useLoadMore) hace scroll al bloque y lo resalta.
 */
export default function LoadMorePagination({
  activePage,
  totalPages,
  goToPage,
  isExpanded,
  loadMore,
  showLess,
  itemsPerPage,
  visibleCount,
  total,
  moduleName = 'Registro',
}) {
  // Solo hay toggle si hay más filas de las que caben en una página
  const canToggle = total > itemsPerPage;
  if (totalPages <= 1 && !canToggle) return null;

  return (
    <div className="mt-6">
      {canToggle && (
        <div className="mb-4 flex justify-center">
          <button
            type="button"
            onClick={isExpanded ? showLess : loadMore}
            className="skip-style-btn px-4 py-2 rounded-lg border border-[#ffffff21] text-sm text-gray-300 hover:text-white transition-colors"
          >
            {isExpanded ? 'Ver menos' : 'Ver más'}
          </button>
        </div>
      )}

      <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
        <div className="text-sm text-white-600">
          Mostrando {visibleCount > 0 ? 1 : 0} a {Math.min(visibleCount, total)} de {total}{' '}
          <b>Total: {total} {moduleName}(s)</b>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => goToPage(activePage - 1)}
            disabled={activePage <= 1}
            className="px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed! transition-colors"
          >
            Anterior
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                  activePage === page
                    ? 'text-[#9fd8ff] border-number-page'
                    : ''
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() => goToPage(activePage + 1)}
            disabled={activePage >= totalPages}
            className="px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed! transition-colors"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
