import { useCallback, useEffect, useState } from 'react';
import { fetchPetSize, fetchPets } from '@/api/pets';
import type { Pet } from '@/types/pet';

export type PetsStatus = 'idle' | 'loading' | 'success' | 'error' | 'empty';

export interface UsePetsResult {
  pets: Pet[];
  status: PetsStatus;
  error: Error | null;
  refetch: () => void;
}

export function usePets(): UsePetsResult {
  const [pets, setPets] = useState<Pet[]>([]);
  const [status, setStatus] = useState<PetsStatus>('idle');
  const [error, setError] = useState<Error | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    setStatus('loading');
    setError(null);

    fetchPets(controller.signal)
      .then((data) => {
        if (cancelled) return;
        setPets(data);
        setStatus(data.length === 0 ? 'empty' : 'success');

        void hydrateSizes(data, (updates) => {
          if (cancelled) return;
          setPets((prev) =>
            prev.map((p) => (updates.has(p.id) ? { ...p, sizeBytes: updates.get(p.id)! } : p)),
          );
        });
      })
      .catch((err: unknown) => {
        if (cancelled || (err instanceof DOMException && err.name === 'AbortError')) {
          return;
        }
        setError(err instanceof Error ? err : new Error(String(err)));
        setStatus('error');
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [tick]);

  return { pets, status, error, refetch };
}


async function hydrateSizes(
  pets: Pet[],
  flush: (updates: Map<string, number | null>) => void,
): Promise<void> {
  const CHUNK = 6;
  for (let i = 0; i < pets.length; i += CHUNK) {
    const chunk = pets.slice(i, i + CHUNK);
    const results = await Promise.all(
      chunk.map(async (p) => [p.id, await fetchPetSize(p.url)] as const),
    );
    flush(new Map(results));
  }
}
