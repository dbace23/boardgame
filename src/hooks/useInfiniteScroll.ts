import { useState, useEffect, useCallback, useRef } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  batchSize?: number;
  delay?: number;
}

export function useInfiniteScroll<T>(
  items: T[],
  options: UseInfiniteScrollOptions = {}
) {
  const {
    threshold = 0.5,
    batchSize = 9,
    delay = 500
  } = options;

  const [displayedItems, setDisplayedItems] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Initialize with first batch
  useEffect(() => {
    setDisplayedItems(items.slice(0, batchSize));
    setPage(1);
    setHasMore(items.length > batchSize);
  }, [items, batchSize]);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const start = page * batchSize;
      const end = start + batchSize;
      const nextItems = items.slice(start, end);

      if (nextItems.length === 0) {
        setHasMore(false);
      } else {
        setDisplayedItems(prev => [...prev, ...nextItems]);
        setPage(prev => prev + 1);
      }
      setLoading(false);
    }, delay);
  }, [loading, hasMore, page, batchSize, items, delay]);

  const lastElementRef = useCallback((node: HTMLElement | null) => {
    if (!node) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadMore, threshold]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    items: displayedItems,
    hasMore,
    loading,
    lastElementRef
  };
}