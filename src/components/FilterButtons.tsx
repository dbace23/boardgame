import React from 'react';
import { TrendingUp, Award, Filter } from 'lucide-react';

interface FilterButtonsProps {
  onTrendingClick: () => void;
  onRankingClick: () => void;
  onFilterClick: () => void;
  activeFilter?: 'trending' | 'ranking' | null;
}

const FilterButtons: React.FC<FilterButtonsProps> = ({ 
  onTrendingClick, 
  onRankingClick, 
  onFilterClick, 
  activeFilter = null 
}) => {
  return (
    <div className="flex flex-wrap gap-2 md:gap-4 mb-6">
      <button
        onClick={onTrendingClick}
        className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          activeFilter === 'trending'
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        } shadow-sm`}
      >
        <TrendingUp className="w-4 h-4 mr-2" />
        Trending
      </button>
      
      <button
        onClick={onRankingClick}
        className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          activeFilter === 'ranking'
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        } shadow-sm`}
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