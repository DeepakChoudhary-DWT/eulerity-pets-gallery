import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Pet } from '@/types/pet';

// Selection lives at app root so it survives navigation between routes
// (e.g. opening a pet detail and coming back must not lose checkboxes).

interface SelectionContextValue {
  selectedIds: Set<string>;
  isSelected: (id: string) => boolean;
  toggle: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clear: () => void;
  selectedPets: (all: Pet[]) => Pet[];
  totalSize: (all: Pet[]) => { knownBytes: number; unknownCount: number };
}

const SelectionContext = createContext<SelectionContextValue | null>(null);

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const isSelected = useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds],
  );

  const toggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback((ids: string[]) => {
    setSelectedIds(new Set(ids));
  }, []);

  const clear = useCallback(() => setSelectedIds(new Set()), []);

  // Helpers consumers can pass the current pet list into. Kept here so the
  // selection is always derived from the live data, never stale snapshots.
  const selectedPets = useCallback(
    (all: Pet[]) => all.filter((p) => selectedIds.has(p.id)),
    [selectedIds],
  );

  const totalSize = useCallback(
    (all: Pet[]) => {
      let knownBytes = 0;
      let unknownCount = 0;
      for (const p of all) {
        if (!selectedIds.has(p.id)) continue;
        if (typeof p.sizeBytes === 'number') knownBytes += p.sizeBytes;
        else unknownCount++;
      }
      return { knownBytes, unknownCount };
    },
    [selectedIds],
  );

  const value = useMemo<SelectionContextValue>(
    () => ({
      selectedIds,
      isSelected,
      toggle,
      selectAll,
      clear,
      selectedPets,
      totalSize,
    }),
    [selectedIds, isSelected, toggle, selectAll, clear, selectedPets, totalSize],
  );

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection(): SelectionContextValue {
  const ctx = useContext(SelectionContext);
  if (!ctx) {
    throw new Error('useSelection must be used inside <SelectionProvider>');
  }
  return ctx;
}
