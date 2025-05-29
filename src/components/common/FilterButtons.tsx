import React from 'react';
import { TrendingUp, Award, Filter } from 'lucide-react';

interface FilterButtonsProps {
  onTrendingClick: () => void;
  onRankingClick: () => void;
  onFilterClick: () => void;
  activeFilter?: 'trending' | 'ranking' | null;
  className?: string;
}

const FilterButtons: React.FC<FilterButtonsProps> = ({ 
  onTrendingClick, 
  onRankingClick, 
  onFilterClick, 
  activeFilter = null,
  className = ''
}) => {
  const buttonClass = (isActive: boolean) => `
    flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors
    ${isActive 
      ? 'bg-blue-600 text-white' 
      : 'bg-white text-gray-700 hover:bg-gray-50'
    } shadow-sm
  `;

  return (
    <div className={`flex flex-wrap gap-2 md:gap-4 ${className}`}>
      <button
        onClick={onTrendingClick}
        className={buttonClass(activeFilter === 'trending')}
      >
        <TrendingUp className="w-4 h-4 mr-2" />
        Trending
      </button>
      
      <button
        onClick={onRankingClick}
        className={buttonClass(activeFilter === 'ranking')}
      >
        <Award className="w-4 h-4 mr-2" />
        Ranking
      </button>
      
      <button
        onClick={onFilterClick}
        className="flex items-center px-4 py-2 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 transition-colors shadow-sm ml-auto"
      >
        <Filter className="w-4 h-4 mr-2" />
        More Filters
      </button>
    </div>
  );
};

export default FilterButtons;