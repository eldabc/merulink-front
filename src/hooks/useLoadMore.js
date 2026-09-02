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
 *
 * Opciones:
 *  - options.initial = { visibleCount, activePage } → posición inicial (solo al montar).
 *  - options.remember = { storage: {get,set}, key, isBaseView, resetToken } → guarda/restaura
 *    la posición del listado base entre navegaciones y al filtrar/limpiar (reutilizable).
 *    - isBaseView: true cuando se muestra el listado base (sin filtrar).
 *    - resetToken: cambia al iniciar una nueva búsqueda/filtro (el filtrado arranca en pág. 1).
 *  - La posición NO se resetea al cambiar la data (solo se recorta si excede el total).
 */
export default function useLoadMore(data = [], itemsPerPage = 10, options = {}) {
  const { initial = null, remember = null } = options;

  const rememberKey = remember?.key;
  const rememberStorage = remember?.storage;
  const isBaseView = remember ? remember.isBaseView : true;
  const resetToken = remember?.resetToken ?? '';

  // Posición inicial: restaurada desde el almacén si estamos en la vista base
  const [visibleCount, setVisibleCount] = useState(() => {
    const pos = rememberStorage?.get(rememberKey)?.position;
    if (rememberStorage && isBaseView && pos?.visibleCount) return pos.visibleCount;
    return initial?.visibleCount ?? itemsPerPage;
  });
  const [activePage, setActivePage] = useState(() => {
    const pos = rememberStorage?.get(rememberKey)?.position;
    if (rememberStorage && isBaseView && pos?.activePage) return pos.activePage;
    return initial?.activePage ?? 1;
  });
  const [pulsePage, setPulsePage] = useState(null);

  // Ref para leer el último visibleCount sin depender de un closure viejo
  const visibleRef = useRef(visibleCount);
  useEffect(() => { visibleRef.current = visibleCount; }, [visibleCount]);

  const total = data.length;
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));

  const visibleItems = data.slice(0, visibleCount);
  const hasMore = visibleCount < total;
  const isExpanded = total > 0 && visibleCount >= total;

  // Transiciones de búsqueda/filtro (solo si hay "remember")
  const wasBaseRef = useRef(isBaseView);
  const prevTokenRef = useRef(resetToken);
  const skipPersistRef = useRef(false);

  useEffect(() => {
    if (!rememberStorage) return;
    const wasBase = wasBaseRef.current;
    const tokenChanged = resetToken !== prevTokenRef.current;
    wasBaseRef.current = isBaseView;
    prevTokenRef.current = resetToken;

    if (!isBaseView) {
      // Vista filtrada: nueva búsqueda/filtro → arranca en la página 1
      if (wasBase || tokenChanged) {
        setVisibleCount(itemsPerPage);
        setActivePage(1);
        setPulsePage(null);
      }
    } else if (!wasBase) {
      // Volvió a la vista base (limpió búsqueda) → restaurar la posición guardada
      skipPersistRef.current = true; // no pisar la posición guardada en este mismo render
      const pos = rememberStorage.get(rememberKey)?.position;
      if (pos) {
        setVisibleCount(pos.visibleCount ?? itemsPerPage);
        setActivePage(pos.activePage ?? 1);
      }
      setPulsePage(null);
    }
  }, [rememberKey, rememberStorage, isBaseView, resetToken, itemsPerPage]);

  // Persistir la posición cuando se navega la vista base
  useEffect(() => {
    if (!rememberStorage || !isBaseView) return;
    if (skipPersistRef.current) { skipPersistRef.current = false; return; }
    const cur = rememberStorage.get(rememberKey) || {};
    rememberStorage.set(rememberKey, { ...cur, position: { visibleCount, activePage } });
  }, [visibleCount, activePage, isBaseView, rememberKey, rememberStorage]);

  // NO resetea la posición al cambiar la data: solo la recorta si excede el total
  // (permite recordar dónde estaba al filtrar/limpiar búsqueda o volver de otra vista).
  useEffect(() => {
    if (total === 0) return; // datos aún cargando: conservar posición
    setVisibleCount((c) => Math.min(c, total));
    setActivePage((p) => Math.min(p, Math.max(1, Math.ceil(total / itemsPerPage))));
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
    visibleCount,
    chunkOf,
    chunkClass,
    itemsPerPage,
    total,
  };
}
