import { createContext, useCallback, useContext, useRef } from 'react';

/**
 * Memoria en memoria (in-memory) para recordar el estado de los listados
 * entre navegaciones (entrar a un detalle y volver, etc.).
 *
 * Cada listado usa una key propia (ej. 'employee-list').
 */
const ListStateContext = createContext(null);

export function ListStateProvider({ children }) {
  const storeRef = useRef(new Map());

  const get = useCallback((key) => storeRef.current.get(key) ?? null, []);
  const set = useCallback((key, value) => { storeRef.current.set(key, value); }, []);
  const clear = useCallback((key) => { storeRef.current.delete(key); }, []);

  return (
    <ListStateContext.Provider value={{ get, set, clear }}>
      {children}
    </ListStateContext.Provider>
  );
}

export function useListState() {
  return useContext(ListStateContext);
}
