import React from 'react';
import { Calendar, MapPin, Users, DollarSign } from 'lucide-react';
import { Event } from '../../types';
import BaseCard from './BaseCard';
import ImageHeader from './ImageHeader';

interface EventCardProps {
  event: Event;
  showJoinButton?: boolean;
  className?: string;
}

const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  showJoinButton = true,
  className = ''
}) => {
  const renderCost = (cost: string) => {
    if (cost === 'free') {
      return <span className="text-green-600">Free</span>;
    }
    
    const dollarSigns = [];
    const costLevel = parseInt(cost.replace(/[^\d]/g, '')) || 1;
    
    for (let i = 0; i < Math.min(costLevel, 3); i++) {
      dollarSigns.push(<DollarSign key={i} className="w-4 h-4 inline" />);
    }
    
    return <div className="text-gray-700">{dollarSigns}</div>;
  };

  const renderStatusBadge = () => (
    <span className={`px-2 py-0.5 rounded-full ${
      event.status === 'recruiting' 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'
    }`}>
      {event.status === 'recruiting' ? 'Recruiting' : 'Full'}
    </span>
  );

  const renderTypeBadge = () => (
    <span className={`px-2 py-0.5 rounded-full ${
      event.type === 'competition' 
        ? 'bg-orange-100 text-orange-800' 
        : 'bg-blue-100 text-blue-800'
    }`}>
      {event.type || 'Meetup'}
    </span>
  );

  const renderJoinTypeBadge = () => (
    <span className={`px-2 py-0.5 rounded-full ${
      event.joinType === 'companion' 
        ? 'bg-purple-100 text-purple-800' 
        : 'bg-teal-100 text-teal-800'
    }`}>
      {event.joinType || 'Open to Public'}
    </span>
  );
  
  return (
    <BaseCard id={event.id} linkTo={`/event/${event.id}`} className={className}>
      <ImageHeader 
        image={event.image || "https://images.pexels.com/photos/4691567/pexels-photo-4691567.jpeg"} 
        alt={event.name}
        aspectRatio="wide"
      />
      
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2 text-sm">
          {renderStatusBadge()}
          <span className="text-gray-600">{event.date}</span>
          {renderTypeBadge()}
        </div>
        
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{event.name}</h3>
        
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="text-gray-600">{event.city}</span>
          {renderJoinTypeBadge()}
        </div>
        
        <div className="flex items-center mb-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{event.location}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="flex items-center text-sm text-gray-600">
              <Users className="w-4 h-4 mr-1" />
              <span>{event.participantCount}/{event.maxParticipants}</span>
            </div>
            <div>{renderCost(event.cost)}</div>
          </div>
          
          {showJoinButton && event.status === 'recruiting' && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Handle registration
              }}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Register
            </button>
          )}
        </div>
        
        <div className="mt-3 text-xs text-gray-500">
          Organized by: {event.organizer}
        </div>
      </div>
    </BaseCard>
  );
};

export default EventCard;