import { useSearchParams, URLSearchParamsInit } from 'react-router-dom';

interface FilterParams {
  [key: string]: string | string[] | undefined;
}

export function useFilterParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const getFilter = (key: string): string | null => {
    return searchParams.get(key);
  };

  const getFilterValues = (key: string): string[] => {
    const values = searchParams.getAll(key);
    return values;
  };

  const setFilter = (key: string, value: string | null) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (value === null) {
      newSearchParams.delete(key);
    } else {
      newSearchParams.set(key, value);
    }
    setSearchParams(newSearchParams);
  };

  const setFilterValues = (key: string, values: string[]) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete(key);
    values.forEach(value => newSearchParams.append(key, value));
    setSearchParams(newSearchParams);
  };

  const clearFilter = (key: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete(key);
    setSearchParams(newSearchParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  return {
    getFilter,
    getFilterValues,
    setFilter,
    setFilterValues,
    clearFilter,
    clearAllFilters
  };
}