import { useState, useCallback, useEffect } from 'react';
import { useDebounce } from './useDebounce';

interface UseSearchOptions<T> {
  data: T[];
  searchFields: (keyof T)[];
  minChars?: number;
  debounceMs?: number;
}

export function useSearch<T>({
  data,
  searchFields,
  minChars = 2,
  debounceMs = 300
}: UseSearchOptions<T>) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, debounceMs);
  const [results, setResults] = useState<T[]>([]);

  const search = useCallback((searchQuery: string) => {
    if (!searchQuery || searchQuery.length < minChars) {
      setResults(data);
      return;
    }

    const normalizedQuery = searchQuery.toLowerCase();
    const searchResults = data.filter(item =>
      searchFields.some(field => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(normalizedQuery);
        }
        if (Array.isArray(value)) {
          return value.some(v => 
            typeof v === 'string' && v.toLowerCase().includes(normalizedQuery)
          );
        }
        return false;
      })
    );

    setResults(searchResults);
  }, [data, searchFields, minChars]);

  useEffect(() => {
    search(debouncedQuery);
  }, [debouncedQuery, search]);

  return {
    query,
    setQuery,
    results,
    search
  };
}