import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Banner from '../components/layout/Banner';
import CafeCard from '../components/cards/CafeCard';
import FilterButtons from '../components/common/FilterButtons';
import { Cafe } from '../types';
import { Plus } from 'lucide-react';

// Mock data for cafes
const mockCafes: Cafe[] = [
  {
    id: '1',
    name: 'Meeple\'s Corner',
    location: 'Downtown',
    address: '123 Main St',
    openingHours: '10:00 AM - 11:00 PM',
    averageBudget: '$15-25',
    boardGameCount: 300,
    eventCount: 5,
    isFollowing: false,
    image: 'https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg'
  },
  {
    id: '2',
    name: 'The Dice Tower',
    location: 'Midtown',
    address: '456 Park Ave',
    openingHours: '11:00 AM - 12:00 AM',
    averageBudget: '$20-30',
    boardGameCount: 500,
    eventCount: 8,
    isFollowing: false,
    image: 'https://images.pexels.com/photos/1024248/pexels-photo-1024248.jpeg'
  },
  {
    id: '3',
    name: 'Cardboard Cafe',
    location: 'Uptown',
    address: '789 Board St',
    openingHours: '12:00 PM - 10:00 PM',
    averageBudget: '$10-20',
    boardGameCount: 200,
    eventCount: 3,
    isFollowing: false,
    image: 'https://images.pexels.com/photos/1579739/pexels-photo-1579739.jpeg'
  }
];

const CafesPage: React.FC = () => {
  const [isAuthenticated] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'trending' | 'ranking' | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const handleFollowToggle = (cafeId: string) => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    // Handle follow/unfollow logic here
    console.log('Toggle follow for cafe:', cafeId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAuthenticated={isAuthenticated} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Banner 
          title="Board Game Cafes & Shops" 
          subtitle="Discover places to play and buy board games" 
          image="https://images.pexels.com/photos/1579739/pexels-photo-1579739.jpeg"
        />
        
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <FilterButtons 
              onTrendingClick={() => setActiveFilter(prev => prev === 'trending' ? null : 'trending')}
              onRankingClick={() => setActiveFilter(prev => prev === 'ranking' ? null : 'ranking')}
              onFilterClick={() => setShowFilterModal(true)}
              activeFilter={activeFilter}
            />
            
            <Link
              to="/new-cafe"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Cafe/Shop
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockCafes.map(cafe => (
              <CafeCard 
                key={cafe.id} 
                cafe={cafe}
                onFollowToggle={handleFollowToggle}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CafesPage;