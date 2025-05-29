import React from 'react';
import { Users, Calendar } from 'lucide-react';
import { Community } from '../../types';
import BaseCard from './BaseCard';
import ImageHeader from './ImageHeader';

interface CommunityCardProps {
  community: Community;
  className?: string;
}

const CommunityCard: React.FC<CommunityCardProps> = ({ 
  community,
  className = ''
}) => {
  return (
    <BaseCard id={community.id} linkTo={`/community/${community.id}`} className={className}>
      <ImageHeader 
        image={community.image || 'https://images.pexels.com/photos/7594067/pexels-photo-7594067.jpeg'} 
        alt={community.name}
        aspectRatio="wide"
      />
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-800">{community.name}</h3>
          <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {community.city}
          </div>
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {community.description}
        </p>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-600">
            <Users className="w-4 h-4 mr-1" />
            <span>{community.memberCount} members</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-1" />
            <span>Last active: {community.lastActive}</span>
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {community.activities.slice(0, 3).map((activity, index) => (
            <span 
              key={index} 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
            >
              {activity}
            </span>
          ))}
          {community.activities.length > 3 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              +{community.activities.length - 3} more
            </span>
          )}
        </div>
      </div>
    </BaseCard>
  );
};

export default CommunityCard;