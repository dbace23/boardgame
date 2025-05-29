import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Banner from '../components/layout/Banner';
import EventCard from '../components/cards/EventCard';
import FilterButtons from '../components/common/FilterButtons';
import { Event } from '../types';
import { Plus } from 'lucide-react';

// Mock data for events
const mockEvents: Event[] = [
  {
    id: '1',
    name: 'Catan Tournament',
    description: 'Join us for an exciting Catan tournament! All skill levels welcome.',
    date: '2024-03-25 14:00',
    location: 'Board Game Cafe Downtown',
    address: '123 Main St, Downtown',
    status: 'recruiting',
    participantCount: 8,
    maxParticipants: 16,
    cost: '$$$',
    organizer: 'John Doe',
    boardGames: ['Catan', 'Catan: Cities & Knights']
  },
  {
    id: '2',
    name: 'Pandemic Legacy Night',
    description: 'Continue our Pandemic Legacy campaign. Chapter 5 coming up!',
    date: '2024-03-26 19:00',
    location: 'The Game Room',
    address: '456 Park Ave, Midtown',
    status: 'full',
    participantCount: 4,
    maxParticipants: 4,
    cost: 'free',
    organizer: 'Jane Smith',
    boardGames: ['Pandemic Legacy: Season 1']
  },
  {
    id: '3',
    name: 'Board Game Social',
    description: 'Casual board gaming night. Bring your favorite games!',
    date: '2024-03-27 18:00',
    location: 'Community Center',
    address: '789 Community Ln',
    status: 'recruiting',
    participantCount: 12,
    maxParticipants: 30,
    cost: '$',
    organizer: 'Board Game Club',
    boardGames: ['Various']
  }
];

const EventsPage: React.FC = () => {
  const [isAuthenticated] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'trending' | 'ranking' | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAuthenticated={isAuthenticated} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Banner 
          title="Board Game Events" 
          subtitle="Join exciting board game events in your area" 
          image="https://images.pexels.com/photos/4691567/pexels-photo-4691567.jpeg"
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
              to="/new-event"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Event
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventsPage;