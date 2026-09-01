import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Hook reutilizable para listados con "Ver más" + paginación tipo scroll vertical.
 *
 * Modelo (client-side, avance incremental):
 *  - Muestra la PRIMERA página (itemsPerPage filas) por defecto.
 *  - "Ver más" → revela `itemsPerPage` filas adicionales (avanza por páginas).
 *  - Cuando ya está todo visible, el botón dice "Mostrar menos" → vuelve a la
 *    primera página resaltando el bloque 1.
 *  - Los números de página expanden lo necesario, hacen scroll al bloque y lo
 *    resaltan (pulso temporal).
 */
export default function useLoadMore(data = [], itemsPerPage = 10) {
  const [visibleCount, setVisibleCount] = useState(itemsPerPage);
  const [activePage, setActivePage] = useState(1);
  const [pulsePage, setPulsePage] = useState(null);

  // Ref para leer el último visibleCount sin depender de un closure viejo
  const visibleRef = useRef(visibleCount);
  useEffect(() => { visibleRef.current = visibleCount; }, [visibleCount]);

  const total = data.length;
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));

  const visibleItems = data.slice(0, visibleCount);
  const hasMore = visibleCount < total;
  const isExpanded = total > 0 && visibleCount >= total;

  // Reset / ajuste cuando cambia la data (filtros, carga inicial)
  useEffect(() => {
    if (total === 0) {
      setVisibleCount(itemsPerPage);
      setActivePage(1);
    } else {
      setVisibleCount((c) => Math.min(c, total));
    }
    setPulsePage(null);
  }, [total, itemsPerPage]);

  /** "Ver más": revela itemsPerPage filas adicionales. */
  const loadMore = useCallback(() => {
    const next = Math.min(total, visibleRef.current + itemsPerPage);
    setVisibleCount(next);
    setActivePage(Math.ceil(next / itemsPerPage));
  }, [total, itemsPerPage]);

  /** "Mostrar menos": colapsa a la primera página y resalta el bloque 1. */
  const showLess = useCallback(() => {
    setVisibleCount(itemsPerPage);
    setActivePage(1);
    setPulsePage(1);
  }, [itemsPerPage]);

  /** Ir a una página: expande lo necesario, marca la página y dispara scroll+pulso. */
  const goToPage = useCallback((page) => {
    const p = Math.min(Math.max(1, page), totalPages);
    setVisibleCount((c) => Math.max(c, p * itemsPerPage));
    setActivePage(p);
    setPulsePage(p);
  }, [totalPages, itemsPerPage]);

  // Scroll al bloque del pulso + desvanecer el sombreado
  useEffect(() => {
    if (pulsePage == null) return;

    const scrollTimer = window.setTimeout(() => {
      const el = document.querySelector(`[data-chunk="${pulsePage}"]`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);

    const pulseTimer = window.setTimeout(() => setPulsePage(null), 1500);

    return () => {
      window.clearTimeout(scrollTimer);
      window.clearTimeout(pulseTimer);
    };
  }, [pulsePage]);

  const chunkOf = useCallback((index) => Math.floor(index / itemsPerPage) + 1, [itemsPerPage]);
  const chunkClass = useCallback(
    (index) => (pulsePage === chunkOf(index) ? 'chunk-pulse' : ''),
    [pulsePage, chunkOf]
  );

  return {
    visibleItems,
    hasMore,
    isExpanded,
    loadMore,
    showLess,
    activePage,
    totalPages,
    goToPage,
    chunkOf,
    chunkClass,
    itemsPerPage,
    total,
  };
}
