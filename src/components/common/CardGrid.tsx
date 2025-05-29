import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface CardGridProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  loading?: boolean;
  hasMore?: boolean;
  lastElementRef?: (node: HTMLElement | null) => void;
  className?: string;
  emptyMessage?: string;
}

function CardGrid<T>({ 
  items, 
  renderItem, 
  loading, 
  hasMore, 
  lastElementRef,
  className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
  emptyMessage = "No items to display"
}: CardGridProps<T>) {
  if (items.length === 0 && !loading) {
    return (
      <div className="text-center text-gray-600 py-8">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={className}>
        {items.map((item, index) => (
          <div 
            key={index} 
            ref={index === items.length - 1 ? lastElementRef : undefined}
          >
            {renderItem(item)}
          </div>
        ))}
      </div>
      
      {loading && <LoadingSpinner />}
      {!hasMore && items.length > 0 && (
        <p className="text-center text-gray-600">No more items to load</p>
      )}
    </div>
  );
}

export default CardGrid;