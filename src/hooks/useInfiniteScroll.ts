import { useEffect, useRef } from 'react';

/**
 * Calls `onIntersect` once each time the returned ref enters the viewport.
 * Used to drive infinite scroll: a sentinel <div ref={...}/> at the end of
 * the grid triggers loading the next page.
 */
export function useInfiniteScroll<T extends HTMLElement>(
  onIntersect: () => void,
  enabled: boolean,
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) onIntersect();
        }
      },
      { rootMargin: '300px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [onIntersect, enabled]);

  return ref;
}
