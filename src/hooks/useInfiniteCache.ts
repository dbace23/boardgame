import { useState, useCallback, useRef } from 'react';

interface CacheItem<T> {
  data: T[];
  timestamp: number;
}

interface UseInfiniteCacheOptions {
  cacheKey: string;
  cacheDuration?: number; // Duration in milliseconds
}

export function useInfiniteCache<T>(options: UseInfiniteCacheOptions) {
  const { cacheKey, cacheDuration = 5 * 60 * 1000 } = options; // Default 5 minutes
  const cacheRef = useRef<Record<string, CacheItem<T>>>({});
  const [loading, setLoading] = useState(false);

  const getCachedData = useCallback((page: number): T[] | null => {
    const key = `${cacheKey}_${page}`;
    const cached = cacheRef.current[key];
    
    if (!cached) return null;
    
    const isExpired = Date.now() - cached.timestamp > cacheDuration;
    if (isExpired) {
      delete cacheRef.current[key];
      return null;
    }
    
    return cached.data;
  }, [cacheKey, cacheDuration]);

  const setCachedData = useCallback((page: number, data: T[]) => {
    const key = `${cacheKey}_${page}`;
    cacheRef.current[key] = {
      data,
      timestamp: Date.now()
    };
  }, [cacheKey]);

  const fetchData = useCallback(async (
    page: number,
    fetchFn: () => Promise<T[]>
  ) => {
    const cachedData = getCachedData(page);
    if (cachedData) return cachedData;

    setLoading(true);
    try {
      const data = await fetchFn();
      setCachedData(page, data);
      return data;
    } finally {
      setLoading(false);
    }
  }, [getCachedData, setCachedData]);

  const clearCache = useCallback(() => {
    cacheRef.current = {};
  }, []);

  return {
    fetchData,
    loading,
    clearCache
  };
}