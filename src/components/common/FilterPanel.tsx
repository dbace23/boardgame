import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterGroupProps {
  title: string;
  options: FilterOption[];
  selected: string[];
  onChange: (values: string[]) => void;
  className?: string;
}

export const FilterGroup: React.FC<FilterGroupProps> = ({
  title,
  options,
  selected,
  onChange,
  className = ''
}) => {
  const toggleOption = (optionId: string) => {
    const newSelected = selected.includes(optionId)
      ? selected.filter(id => id !== optionId)
      : [...selected, optionId];
    onChange(newSelected);
  };

  return (
    <div className={className}>
      <h3 className="text-sm font-medium text-gray-900 mb-2">{title}</h3>
      <div className="space-y-2">
        {options.map(option => (
          <label key={option.id} className="flex items-center">
            <input
              type="checkbox"
              checked={selected.includes(option.id)}
              onChange={() => toggleOption(option.id)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">{option.label}</span>
            {option.count !== undefined && (
              <span className="ml-auto text-xs text-gray-500">{option.count}</span>
            )}
          </label>
        ))}
      </div>
    </div>
  );
};

interface SortOption {
  value: string;
  label: string;
}

interface FilterPanelProps {
  filterGroups: {
    id: string;
    title: string;
    options: FilterOption[];
  }[];
  selectedFilters: Record<string, string[]>;
  onFilterChange: (groupId: string, values: string[]) => void;
  sortOptions?: SortOption[];
  selectedSort?: string;
  onSortChange?: (value: string) => void;
  className?: string;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filterGroups,
  selectedFilters,
  onFilterChange,
  sortOptions,
  selectedSort,
  onSortChange,
  className = ''
}) => {
  const hasActiveFilters = Object.values(selectedFilters).some(group => group.length > 0);

  const clearAllFilters = () => {
    filterGroups.forEach(group => {
      onFilterChange(group.id, []);
    });
  };

  return (
    <div className={cn('bg-white rounded-lg shadow-lg p-6', className)}>
      {sortOptions && onSortChange && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Sort By</h3>
          <select
            value={selectedSort}
            onChange={(e) => onSortChange(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {hasActiveFilters && (
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">Active Filters</h3>
            <button
              onClick={clearAllFilters}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear all
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {filterGroups.map(group => (
              selectedFilters[group.id]?.map(filterId => {
                const option = group.options.find(opt => opt.id === filterId);
                if (!option) return null;
                return (
                  <button
                    key={`${group.id}-${filterId}`}
                    onClick={() => onFilterChange(
                      group.id,
                      selectedFilters[group.id].filter(id => id !== filterId)
                    )}
                    className="inline-flex items-center px-2.5 py-1.5 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {option.label}
                    <X className="w-4 h-4 ml-1" />
                  </button>
                );
              })
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {filterGroups.map(group => (
          <FilterGroup
            key={group.id}
            title={group.title}
            options={group.options}
            selected={selectedFilters[group.id] || []}
            onChange={(values) => onFilterChange(group.id, values)}
          />
        ))}
      </div>
    </div>
  );
};

export default FilterPanel;