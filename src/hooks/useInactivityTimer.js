import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Solo eventos que implican acción real del usuario.
 * click  → navegar, abrir menús, seleccionar filas, guardar formularios
 * keydown → escribir en inputs, atajos de teclado
 */
const ACTIVITY_EVENTS = ['click', 'keydown'];

/**
 * Hook que detecta inactividad del usuario basada en acciones reales (click, teclas, navegación).
 * Optimizado para NO causar re-renders innecesarios en cada evento de actividad.
 */
export function useInactivityTimer({
  timeoutMinutes = 15,
  warningMinutes = 2,
  onExpire,
}) {
  const [showWarning, setShowWarning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const timeoutRef = useRef(null);
  const warningRef = useRef(null);
  const countdownRef = useRef(null);
  const onExpireRef = useRef(onExpire);
  const showWarningRef = useRef(false);
  const remainingRef = useRef(0);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  const clearAllTimers = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
  }, []);

  /**
   * Solo llama a setState si el valor realmente cambió.
   * Esto evita que cada click en la app fuerce un re-render de MainLayout.
   */
  const safeSetWarning = useCallback((val) => {
    if (showWarningRef.current !== val) {
      showWarningRef.current = val;
      setShowWarning(val);
    }
  }, []);

  const safeSetRemaining = useCallback((val) => {
    if (remainingRef.current !== val) {
      remainingRef.current = val;
      setRemainingSeconds(val);
    }
  }, []);

  const startTimers = useCallback(() => {
    clearAllTimers();

    // Solo llama a setState si realmente hay que cambiar algo
    safeSetWarning(false);
    safeSetRemaining(0);

    const warningMs = (timeoutMinutes - warningMinutes) * 60 * 1000;
    const timeoutMs = timeoutMinutes * 60 * 1000;

    if (warningMs > 0) {
      warningRef.current = setTimeout(() => {
        safeSetWarning(true);
        safeSetRemaining(warningMinutes * 60);

        countdownRef.current = setInterval(() => {
          setRemainingSeconds(prev => {
            const next = prev <= 1 ? 0 : prev - 1;
            remainingRef.current = next;
            if (next === 0) clearInterval(countdownRef.current);
            return next;
          });
        }, 1000);
      }, warningMs);
    }

    timeoutRef.current = setTimeout(() => {
      clearAllTimers();
      onExpireRef.current?.();
    }, timeoutMs);
  }, [timeoutMinutes, warningMinutes, clearAllTimers, safeSetWarning, safeSetRemaining]);

  const resetTimer = useCallback(() => {
    startTimers();
  }, [startTimers]);

  useEffect(() => {
    ACTIVITY_EVENTS.forEach(event =>
      window.addEventListener(event, resetTimer, { passive: true })
    );
    startTimers();

    return () => {
      ACTIVITY_EVENTS.forEach(event =>
        window.removeEventListener(event, resetTimer)
      );
      clearAllTimers();
    };
  }, [resetTimer, startTimers, clearAllTimers]);

  return { showWarning, remainingSeconds, resetTimer };
}
