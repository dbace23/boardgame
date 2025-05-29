import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Banner from '../components/layout/Banner';
import GameCard from '../components/cards/GameCard';
import FilterButtons from '../components/common/FilterButtons';
import { Game } from '../types';
import { Plus } from 'lucide-react';
import { useFilterParams } from '../hooks/useFilterParams';

// Constants
const BANNER_IMAGE = 'https://images.pexels.com/photos/776654/pexels-photo-776654.jpeg';

// Mock data - In production, this would come from an API
const mockGames: Game[] = [
  {
    id: '1',
    name: 'Catan',
    image: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
    description: 'Trade, build and settle.',
    categories: ['Strategy', 'Family'],
    publisher: 'Kosmos',
    ageRecommendation: '10+',
    playerCount: '3-4',
    mechanics: ['Dice Rolling', 'Trading'],
    rating: 4.3,
    likes: 2451,
    owners: 8720,
    comments: 1324
  },
  // ... other games
];

/**
 * GamesPage Component
 * 
 * Displays a grid of board games with filtering and sorting options.
 * Allows authenticated users to add new games.
 */
const GamesPage: React.FC = () => {
  // State management
  const [isAuthenticated] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'trending' | 'ranking' | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const { getFilterValues, setFilterValues } = useFilterParams();

  // Filter games based on active filter
  const filteredGames = useMemo(() => {
    if (!activeFilter) return mockGames;

    return mockGames.sort((a, b) => {
      if (activeFilter === 'trending') {
        return b.likes - a.likes;
      }
      return b.rating - a.rating;
    });
  }, [activeFilter, mockGames]);

  // Event handlers
  const handleFilterChange = (filter: 'trending' | 'ranking') => {
    setActiveFilter(prev => prev === filter ? null : filter);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Banner 
          title="Board Games" 
          subtitle="Discover and explore your next favorite board game" 
          image={BANNER_IMAGE}
        />
        
        <div className="mt-8">
          {/* Header with filters and add button */}
          <div className="flex justify-between items-center mb-6">
            <FilterButtons 
              onTrendingClick={() => handleFilterChange('trending')}
              onRankingClick={() => handleFilterChange('ranking')}
              onFilterClick={() => setShowFilterModal(true)}
              activeFilter={activeFilter}
            />
            
            <Link
              to="/new-game"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Game
            </Link>
          </div>
          
          {/* Games grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map(game => (
              <GameCard 
                key={game.id} 
                game={game}
                className="transform hover:-translate-y-1 transition-transform duration-200"
              />
            ))}
          </div>

          {/* Empty state */}
          {filteredGames.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No games found matching your criteria.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default GamesPage;