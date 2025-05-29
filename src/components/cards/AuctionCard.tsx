import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Star, Eye, TrendingUp } from 'lucide-react';
import { formatDistanceToNow, isPast } from 'date-fns';
import { formatCurrency } from '../../utils/format';
import { useCountdown } from '../../hooks/useCountdown';

interface Auction {
  id: string;
  title: string;
  gameId: string;
  gameName: string;
  gameImage: string;
  currentPrice: number;
  buyNowPrice?: number;
  endTime: string;
  condition: string;
  bids: number;
  watchers: number;
  bidIncrement?: number;
  seller: {
    id: string;
    name: string;
    rating: number;
    totalSales: number;
    successfulSales: number;
  };
}

interface AuctionCardProps {
  auction: Auction;
  className?: string;
}

const AuctionCard: React.FC<AuctionCardProps> = ({
  auction,
  className = ''
}) => {
  const { timeLeft, isExpired } = useCountdown(auction.endTime);
  
  const conditionLabel = {
    new: 'New',
    like_new: 'Like New',
    very_good: 'Very Good',
    good: 'Good',
    acceptable: 'Acceptable'
  }[auction.condition];

  const renderTimeLeft = () => {
    if (isExpired) {
      return <span className="text-red-600">Auction ended</span>;
    }

    const parts = timeLeft.split(' ');
    return (
      <div className="flex items-center space-x-1">
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            {index % 2 === 0 ? (
              <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">{part}</span>
            ) : (
              <span className="text-gray-500">{part}</span>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <Link
      to={`/marketplace/${auction.id}`}
      className={`block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${className}`}
    >
      <div className="relative pb-[56.25%]">
        <img
          src={auction.gameImage}
          alt={auction.gameName}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {auction.buyNowPrice && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
            Buy Now: {formatCurrency(auction.buyNowPrice)}
          </div>
        )}
        {isExpired && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-xl">ENDED</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{auction.title}</h3>
        
        <div className="flex items-center justify-between mb-2">
          <div className="text-lg font-bold text-blue-600">
            {formatCurrency(auction.currentPrice)}
            {auction.bidIncrement && (
              <span className="text-xs text-gray-500 ml-1">
                +{formatCurrency(auction.bidIncrement)}/bid
              </span>
            )}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            {renderTimeLeft()}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <span>{conditionLabel}</span>
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              {auction.bids} bids
            </span>
            <span className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              {auction.watchers}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <span className="font-medium">{auction.seller.name}</span>
            <div className="flex items-center ml-2">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="ml-1">{auction.seller.rating}</span>
            </div>
          </div>
          <span className="text-gray-500">{auction.seller.successfulSales}/{auction.seller.totalSales} sales</span>
        </div>
      </div>
    </Link>
  );
};

export default AuctionCard;