import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { tabs } from '../../../utils/tabs-utils';
import TabButtons from '../../Shared/TabButtons';
import { useAuth } from '../../../context/AuthContext';

export default function TabButtonsManager({ activeTab, setActiveTab, errors }) {
    const { user } = useAuth();
    const scrollRef = useRef(null);

    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [hiddenTabs, setHiddenTabs] = useState([]);

    const visibleTabs = tabs.filter((tab) => {
        if (tab.id === 'meruLink') {
            return user?.permissions?.includes('manage-merulink-tab-employees');
        }
        return true;
    });

    // Recalcula el overflow, hacia dónde se puede scrollear y qué pestañas
    const updateOverflow = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;

        setCanScrollLeft(el.scrollLeft > 1);
        setCanScrollRight(
            el.scrollWidth > el.clientWidth + 1 &&
            el.scrollLeft < el.scrollWidth - el.clientWidth - 1
        );

        const hidden = [];
        el.querySelectorAll('[data-tab-id]').forEach((tabEl) => {
            // Ignorar pestañas ocultas por CSS (display:none)
            if (!tabEl.offsetWidth || !tabEl.offsetHeight) return;

            const id = tabEl.getAttribute('data-tab-id');
            const left = tabEl.offsetLeft;
            const right = left + tabEl.offsetWidth;
            const viewLeft = el.scrollLeft;
            const viewRight = el.scrollLeft + el.clientWidth;

            // "No visible" si no cabe completa dentro del viewport actual
            if (!(left >= viewLeft && right <= viewRight)) hidden.push(id);
        });
        setHiddenTabs(hidden);
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
    }, [updateOverflow, visibleTabs.length]);

    // Recalcular el overflow al cambiar de pestaña activa
    useEffect(() => {
        updateOverflow();
    }, [activeTab, updateOverflow]);

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
        el.scrollBy({ left: direction * 220, behavior: 'smooth' });
    };

    const handleSelectTab = (tabId) => {
        setActiveTab(tabId);
        setShowMore(false);

        // Llevar la pestaña seleccionada al centro del carrusel
        const el = scrollRef.current;
        if (!el) return;
        const target = el.querySelector(`[data-tab-id="${tabId}"]`);
        if (target) target.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    };

    // Determina si una pestaña tiene errores de formulario
    const getTabError = (tab) => {
        if (!errors) return false;

        const personalKeys = ['numEmployee','birthdate','placeOfBirth','nationality','age', 'sex','ci','maritalStatus','bloodType','email','mobilePhone','homePhone','address'];
        const workKeys = ['joinDate','department','subDepartment','position'];
        const meruLinkKeys = ['userName', 'userPass', 'roleId'];
        const lockerAssignKeys = ['lockerAssingId'];

        if (tab.id === 'personal') return personalKeys.some(k => Object.prototype.hasOwnProperty.call(errors, k));
        if (tab.id === 'work') return workKeys.some(k => Object.prototype.hasOwnProperty.call(errors, k));
        if (tab.id === 'contact') return !!errors.contacts;
        if (tab.id === 'meruLink') return meruLinkKeys.some(k => Object.prototype.hasOwnProperty.call(errors, k));
        if (tab.id === 'lockerAssign') return lockerAssignKeys.some(k => Object.prototype.hasOwnProperty.call(errors, k));
        return false;
    };
console.log("canScrollLfet", canScrollLeft)
    // Clases de los botones de icono (flechas y "...")
    const iconBtn = (enabled) =>
        `skip-style-btn shrink-0 p-1.5 rounded-full text-gray-400 transition-colors ${
            enabled ? 'hover:text-[#9fd8ff] cursor-pointer' : 'opacity-25 cursor-default'
        }`;

    return (
        <div className="flex items-center gap-1 mt-6 border-b border-gray-700">
            {/* Flecha izquierda (carousel) */}
            <button
                type="button"
                onClick={() => scrollBy(-1)}
                disabled={!canScrollLeft}
                className={iconBtn(canScrollLeft)}
                aria-label="Ver pestañas anteriores"
                title="Ver pestañas anteriores"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Pestañas (carrusel horizontal que se adapta al ancho) */}
            <div ref={scrollRef} className="relative flex items-center gap-4 flex-1 overflow-x-auto no-scrollbar">
                {visibleTabs.map((tab) => (
                    <TabButtons
                        key={tab.id}
                        tabId={tab.id}
                        setActiveTab={handleSelectTab}
                        activeTab={activeTab}
                        tabLabel={tab.label}
                        tabError={getTabError(tab)}
                    />
                ))}
            </div>

            {/* Flecha derecha (carousel) */}
            <button
                type="button"
                onClick={() => scrollBy(1)}
                disabled={!canScrollRight}
                className={iconBtn(canScrollRight)}
                aria-label="Ver más pestañas"
                title="Ver más pestañas"
            >
                <ChevronRight className="w-5 h-5" />
            </button>

            {/* Botón "..." con las pestañas que no se ven completas */}
            {hiddenTabs.length > 0 && (
                <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                        type="button"
                        onClick={() => setShowMore((v) => !v)}
                        className={`${iconBtn(true)} ${showMore ? 'text-[#9fd8ff]' : ''}`}
                        aria-label="Ver pestañas ocultas"
                        title="Ver pestañas ocultas"
                    >
                        <MoreHorizontal className="w-5 h-5" />
                    </button>

                    {showMore && (
                        <div className="absolute right-0 top-full mt-2 z-50 min-w-44 py-1 bg-[#2f3235] border border-[#ffffff21] rounded-lg shadow-2xl">
                            {hiddenTabs.map((id) => {
                                const tab = tabs.find((t) => t.id === id);
                                if (!tab) return null;
                                return (
                                    <button
                                        key={id}
                                        type="button"
                                        onClick={() => handleSelectTab(id)}
                                        className={`block w-full text-left px-4 py-2 text-sm transition-colors hover:bg-[#ffffff15] ${
                                            activeTab === id ? 'text-[#9fd8ff]' : 'text-gray-300'
                                        }`}
                                    >
                                        {tab.label}
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