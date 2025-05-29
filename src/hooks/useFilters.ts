import { useState, useCallback, useEffect } from 'react';

interface UseFiltersOptions<T> {
  initialFilters?: Record<string, string[]>;
  initialSort?: string;
  data: T[];
  filterFn?: (item: T, filters: Record<string, string[]>) => boolean;
  sortFn?: (a: T, b: T, sortKey: string) => number;
  persistKey?: string;
}

export function useFilters<T>({
  initialFilters = {},
  initialSort = '',
  data,
  filterFn,
  sortFn,
  persistKey
}: UseFiltersOptions<T>) {
  // Load persisted state
  const loadPersistedState = () => {
    if (!persistKey) return { filters: initialFilters, sort: initialSort };
    
    const persisted = localStorage.getItem(persistKey);
    if (!persisted) return { filters: initialFilters, sort: initialSort };

    try {
      return JSON.parse(persisted);
    } catch {
      return { filters: initialFilters, sort: initialSort };
    }
  };

  const [filters, setFilters] = useState(loadPersistedState().filters);
  const [sortKey, setSortKey] = useState(loadPersistedState().sort);

  // Persist state changes
  useEffect(() => {
    if (persistKey) {
      localStorage.setItem(persistKey, JSON.stringify({ filters, sort: sortKey }));
    }
  }, [filters, sortKey, persistKey]);

  const updateFilters = useCallback((groupId: string, values: string[]) => {
    setFilters(prev => ({
      ...prev,
      [groupId]: values
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
    setSortKey(initialSort);
  }, [initialFilters, initialSort]);

  const filteredData = useCallback(() => {
    let result = [...data];

    // Apply filters
    if (filterFn) {
      result = result.filter(item => filterFn(item, filters));
    }

    // Apply sorting
    if (sortFn && sortKey) {
      result.sort((a, b) => sortFn(a, b, sortKey));
    }

    return result;
  }, [data, filters, sortKey, filterFn, sortFn]);

  return {
    filters,
    updateFilters,
    clearFilters,
    sortKey,
    setSortKey,
    filteredData: filteredData()
  };
}