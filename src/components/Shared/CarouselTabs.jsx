import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

/**
 * Barra de tabs/pestañas reutilizable tipo carrusel.
 *
 * - Se adapta al ancho disponible (scroll horizontal sin scrollbar).
 * - Si no caben todos los items, muestra flechas ‹ › para desplazarse.
 * - Si hay items que no se ven completos, muestra un botón "..." con un
 *   dropdown para acceder a ellos (se cierra al hacer clic fuera).
 *
 * Props:
 * - items:          array de items (cualquier forma; requiere `id`).
 * - activeId:       id del item activo.
 * - onSelect:       (id) => void, se llama al seleccionar un item.
 * - renderItem:     (item, { isActive, onSelect }) => ReactNode. Define cómo
 *                   se ve cada item dentro del carrusel.
 * - getLabel:       (item) => string, texto para el dropdown "..." (default:
 *                   item.label ?? item.name ?? String(item.id)).
 * - showArrows:     boolean, mostrar flechas ‹ › (default true).
 * - showMoreButton: boolean, mostrar botón "..." (default true).
 * - scrollAmount:   px que se desplaza por cada click de flecha (default 220).
 * - gapClass:       clase tailwind del espacio entre items (default 'gap-4').
 * - className:      clases extra para el contenedor.
 */
export default function CarouselTabs({
  items = [],
  activeId,
  onSelect,
  renderItem,
  getLabel,
  showArrows = true,
  showMoreButton = true,
  scrollAmount = 220,
  gapClass = 'gap-4',
  className = '',
}) {
  const scrollRef = useRef(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [hiddenItems, setHiddenItems] = useState([]);

  const labelOf = getLabel || ((item) => item.label ?? item.name ?? String(item.id));

  // Recalcula el overflow, hacia dónde se puede scrollear y qué items no se
  // ven completos (para el menú "...").
  const updateOverflow = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(
      el.scrollWidth > el.clientWidth + 1 &&
      el.scrollLeft < el.scrollWidth - el.clientWidth - 1
    );

    const hidden = [];
    el.querySelectorAll('[data-item-id]').forEach((itemEl) => {
      // Ignorar items ocultos por CSS (display:none)
      if (!itemEl.offsetWidth || !itemEl.offsetHeight) return;

      const id = itemEl.getAttribute('data-item-id');
      const left = itemEl.offsetLeft;
      const right = left + itemEl.offsetWidth;
      const viewLeft = el.scrollLeft;
      const viewRight = el.scrollLeft + el.clientWidth;

      // "No visible" si no cabe completo dentro del viewport actual
      if (!(left >= viewLeft && right <= viewRight)) hidden.push(id);
    });
    setHiddenItems(hidden);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateOverflow();

    el.addEventListener('scroll', updateOverflow, { passive: true });
    window.addEventListener('resize', updateOverflow);
    const observer = new ResizeObserver(updateOverflow);
    observer.observe(el);

    return () => {
      el.removeEventListener('scroll', updateOverflow);
      window.removeEventListener('resize', updateOverflow);
      observer.disconnect();
    };
  }, [updateOverflow, items.length]);

  // Recalcular el overflow al cambiar el item activo
  useEffect(() => {
    updateOverflow();
  }, [activeId, updateOverflow]);

  // Cerrar el menú "..." al hacer clic fuera
  useEffect(() => {
    if (!showMore) return;
    const closeOnClick = () => setShowMore(false);
    document.addEventListener('click', closeOnClick);
    return () => document.removeEventListener('click', closeOnClick);
  }, [showMore]);

  const scrollBy = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
  };

  const handleSelect = (id) => {
    onSelect?.(id);
    setShowMore(false);

    // Llevar el item seleccionado al centro del carrusel
    const el = scrollRef.current;
    if (!el) return;
    const target = el.querySelector(`[data-item-id="${id}"]`);
    if (target) target.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };

  const iconBtn = (enabled) =>
    `skip-style-btn shrink-0 p-1.5 rounded-full text-gray-400 transition-colors ${
      enabled ? 'hover:text-[#9fd8ff] cursor-pointer' : 'opacity-25 cursor-default'
    }`;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {/* Flecha izquierda */}
      {showArrows && (
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          disabled={!canScrollLeft}
          className={iconBtn(canScrollLeft)}
          aria-label="Ver anteriores"
          title="Ver anteriores"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Items (carrusel horizontal que se adapta al ancho) */}
      <div ref={scrollRef} className={`relative flex items-center ${gapClass} flex-1 overflow-x-auto no-scrollbar`}>
        {items.map((item) => {
          const id = item.id;
          const isActive = String(id) === String(activeId);
          return (
            <div key={id} data-item-id={id} className="shrink-0">
              {renderItem(item, { isActive, onSelect: () => handleSelect(id) })}
            </div>
          );
        })}
      </div>

      {/* Flecha derecha */}
      {showArrows && (
        <button
          type="button"
          onClick={() => scrollBy(1)}
          disabled={!canScrollRight}
          className={iconBtn(canScrollRight)}
          aria-label="Ver más"
          title="Ver más"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Botón "..." con los items que no se ven completos */}
      {showMoreButton && hiddenItems.length > 0 && (
        <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setShowMore((v) => !v)}
            className={`${iconBtn(true)} ${showMore ? 'text-[#9fd8ff]' : ''}`}
            aria-label="Ver todos"
            title="Ver todos"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {showMore && (
            <div className="absolute right-0 top-full mt-2 z-50 min-w-44 py-1 bg-[#2f3235] border border-[#ffffff21] rounded-lg shadow-2xl">
              {hiddenItems.map((id) => {
                const item = items.find((it) => String(it.id) === String(id));
                if (!item) return null;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleSelect(id)}
                    className={`block w-full text-left px-4 py-2 text-sm transition-colors hover:bg-[#ffffff15] ${
                      String(id) === String(activeId) ? 'text-[#9fd8ff]' : 'text-gray-300'
                    }`}
                  >
                    {labelOf(item)}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
