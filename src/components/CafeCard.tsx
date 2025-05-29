import React from 'react';
import { Clock, DollarSign, Package, Calendar, Heart } from 'lucide-react';
import { Cafe } from '../types';
import { Link } from 'react-router-dom';

interface CafeCardProps {
  cafe: Cafe;
  onFollowToggle: (cafeId: string) => void;
}

const CafeCard: React.FC<CafeCardProps> = ({ cafe, onFollowToggle }) => {
  const handleFollowClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFollowToggle(cafe.id);
  };

  return (
    <Link to={`/cafe/${cafe.id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div className="relative pb-[40%] overflow-hidden">
          <img 
            src={cafe.image} 
            alt={cafe.name} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-800">{cafe.name}</h3>
            <button 
              onClick={handleFollowClick}
              className={`p-1.5 rounded-full ${
                cafe.isFollowing ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Heart className={`w-4 h-4 ${cafe.isFollowing ? 'fill-red-600' : ''}`} />
            </button>
          </div>
          
          <div className="flex items-center mb-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-1" />
            <span>{cafe.openingHours}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="flex items-center text-sm text-gray-600">
              <DollarSign className="w-4 h-4 mr-1" />
              <span>Avg: {cafe.averageBudget}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <Package className="w-4 h-4 mr-1" />
              <span>{cafe.boardGameCount} games</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600 col-span-2">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{cafe.eventCount} upcoming events</span>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            <span className="font-medium">Location:</span> {cafe.location}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CafeCard;