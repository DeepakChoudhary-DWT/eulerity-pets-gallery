import { useCallback, useEffect, useState } from 'react';
import { fetchPetSize, fetchPets } from '@/api/pets';
import type { Pet } from '@/types/pet';

// Required custom hook for "Loading and Managing Data". Surfaces explicit
// loading / error / empty states plus a `refetch` for the retry button.

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
  // `tick` is a manual cache-buster so refetch() can force a re-run.
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

        // Best-effort, fire-and-forget HEAD probes to fill in file sizes.
        // Concurrency is naturally bounded by the small list size; we
        // batch updates to avoid one re-render per pet.
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

// Hydrate sizes in chunks of 6 to avoid hammering the CDN; flush each
// chunk to the consumer as a Map so we re-render at most a handful of
// times during the warm-up.
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
