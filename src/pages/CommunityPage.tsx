import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Banner from '../components/layout/Banner';
import CommunityCard from '../components/cards/CommunityCard';
import FilterButtons from '../components/common/FilterButtons';
import { Community } from '../types';
import { Plus } from 'lucide-react';

// Mock data for communities
const mockCommunities: Community[] = [
  {
    id: '1',
    name: 'Strategy Gamers United',
    description: 'A community for strategy board game enthusiasts. We meet weekly to play games like Terraforming Mars, Scythe, and more.',
    city: 'New York',
    memberCount: 156,
    lastActive: '2 hours ago',
    activities: ['Strategy Games', 'Tournaments', 'Game Nights'],
    administrator: 'Sarah Johnson',
    mainArea: 'Manhattan',
    mainLocations: ['Central Park', 'Board Game Cafe Downtown'],
    image: 'https://images.pexels.com/photos/7594067/pexels-photo-7594067.jpeg'
  },
  {
    id: '2',
    name: 'Family Board Games',
    description: 'Family-friendly board gaming community. Perfect for parents and kids who love board games.',
    city: 'Boston',
    memberCount: 89,
    lastActive: '1 day ago',
    activities: ['Family Games', 'Learning Sessions', 'Weekend Meetups'],
    administrator: 'Mike Wilson',
    mainArea: 'Greater Boston',
    mainLocations: ['Community Center', 'Local Library'],
    image: 'https://images.pexels.com/photos/1111597/pexels-photo-1111597.jpeg'
  },
  {
    id: '3',
    name: 'Party Game Enthusiasts',
    description: 'Love party games? Join us for regular game nights filled with laughter and fun!',
    city: 'Chicago',
    memberCount: 234,
    lastActive: '3 hours ago',
    activities: ['Party Games', 'Social Events', 'Game Exchange'],
    administrator: 'Alex Thompson',
    mainArea: 'Downtown Chicago',
    mainLocations: ['The Game Room', 'Various Cafes'],
    image: 'https://images.pexels.com/photos/1436891/pexels-photo-1436891.jpeg'
  }
];

const CommunityPage: React.FC = () => {
  const [isAuthenticated] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'trending' | 'ranking' | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAuthenticated={isAuthenticated} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Banner 
          title="Board Game Communities" 
          subtitle="Connect with fellow board game enthusiasts in your area" 
          image="https://images.pexels.com/photos/7594067/pexels-photo-7594067.jpeg"
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
              to="/new-community"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Community
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockCommunities.map(community => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CommunityPage;