import { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { usePets } from '@/hooks/usePets';
import { useDebounce } from '@/hooks/useDebounce';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useSelection } from '@/context/SelectionContext';
import type { Pet, SortKey } from '@/types/pet';
import { PetGrid } from '@/components/PetGrid/PetGrid';
import { PetCard } from '@/components/PetCard/PetCard';
import { SearchBar } from '@/components/SearchBar/SearchBar';
import { SortDropdown } from '@/components/SortDropdown/SortDropdown';
import { SelectionBar } from '@/components/SelectionBar/SelectionBar';
import { SkeletonCard } from '@/components/Skeleton/SkeletonCard';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import { ErrorState } from '@/components/ErrorState/ErrorState';
import { Spinner } from '@/components/Spinner/Spinner';

const PAGE_SIZE = 12;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
`;

const Sentinel = styled.div`
  display: flex;
  justify-content: center;
  padding: 24px 0 8px;
`;

const Heading = styled.h1`
  margin: 0 0 16px;
  font-size: 28px;
  letter-spacing: -0.01em;
`;

/**
 * Pure helper — applies search + sort to the pet list. Lives outside the
 * component so it's trivial to unit-test.
 */
function filterAndSort(pets: Pet[], query: string, sort: SortKey): Pet[] {
  const q = query.trim().toLowerCase();
  const filtered = q
    ? pets.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      )
    : pets;

  const sorted = [...filtered];
  switch (sort) {
    case 'name-asc':
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'name-desc':
      sorted.sort((a, b) => b.title.localeCompare(a.title));
      break;
    case 'date-newest':
      sorted.sort((a, b) => +new Date(b.created) - +new Date(a.created));
      break;
    case 'date-oldest':
      sorted.sort((a, b) => +new Date(a.created) - +new Date(b.created));
      break;
  }
  return sorted;
}

export function GalleryPage() {
  const { pets, status, error, refetch } = usePets();
  const { isSelected, toggle } = useSelection();

  const [rawQuery, setRawQuery] = useState('');
  const query = useDebounce(rawQuery, 180);
  const [sort, setSort] = useState<SortKey>('name-asc');
  const [pageCount, setPageCount] = useState(1);

  const visiblePets = useMemo(
    () => filterAndSort(pets, query, sort),
    [pets, query, sort],
  );

  const visibleSlice = useMemo(
    () => visiblePets.slice(0, pageCount * PAGE_SIZE),
    [visiblePets, pageCount],
  );

  const hasMore = visibleSlice.length < visiblePets.length;

  // Reset pagination whenever the filter/sort changes — otherwise we'd be
  // showing stale rows from the previous query.
  const handleQueryChange = useCallback((v: string) => {
    setRawQuery(v);
    setPageCount(1);
  }, []);
  const handleSortChange = useCallback((v: SortKey) => {
    setSort(v);
    setPageCount(1);
  }, []);

  const loadMore = useCallback(() => {
    setPageCount((c) => c + 1);
  }, []);

  const sentinelRef = useInfiniteScroll<HTMLDivElement>(loadMore, hasMore);

  return (
    <>
      <Heading>Pet Gallery</Heading>

      <Toolbar>
        <SearchBar value={rawQuery} onChange={handleQueryChange} />
        <SortDropdown value={sort} onChange={handleSortChange} />
      </Toolbar>

      <SelectionBar visiblePets={visiblePets} allPets={pets} />

      {status === 'loading' && (
        <PetGrid>
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </PetGrid>
      )}

      {status === 'error' && error && <ErrorState error={error} onRetry={refetch} />}

      {status === 'empty' && (
        <EmptyState
          title="No pets found"
          message="The /pets endpoint returned an empty list."
        />
      )}

      {status === 'success' && visiblePets.length === 0 && (
        <EmptyState
          title="No matches"
          message={`Nothing matched "${query}". Try a different search.`}
        />
      )}

      {status === 'success' && visiblePets.length > 0 && (
        <>
          <PetGrid>
            {visibleSlice.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                selected={isSelected(pet.id)}
                onToggle={toggle}
              />
            ))}
          </PetGrid>
          {hasMore && (
            <Sentinel ref={sentinelRef} aria-hidden>
              <Spinner />
            </Sentinel>
          )}
        </>
      )}
    </>
  );
}
