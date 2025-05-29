import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Banner from '../components/layout/Banner';
import { Plus, Search, Filter } from 'lucide-react';
import { useAuth } from '../components/providers/AuthProvider';
import AuctionCard from '../components/cards/AuctionCard';
import FilterPanel from '../components/common/FilterPanel';
import { useFilterParams } from '../hooks/useFilterParams';

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
  seller: {
    id: string;
    name: string;
    rating: number;
    totalSales: number;
  };
}

const MarketplacePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { getFilterValues, setFilterValues, clearAllFilters } = useFilterParams();

  // Get filter values from URL
  const selectedConditions = getFilterValues('condition');
  const selectedPriceRanges = getFilterValues('priceRange');
  const selectedCategories = getFilterValues('category');

  // Mock auctions data
  const auctions: Auction[] = [
    {
      id: '1',
      title: 'Catan Board Game - Like New Condition',
      gameId: '1',
      gameName: 'Catan',
      gameImage: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
      currentPrice: 25.00,
      buyNowPrice: 45.00,
      endTime: '2024-05-20T15:00:00Z',
      condition: 'like_new',
      bids: 5,
      watchers: 12,
      seller: {
        id: '1',
        name: 'John Doe',
        rating: 4.8,
        totalSales: 45
      }
    },
    {
      id: '2',
      title: 'Ticket to Ride - New in Shrink',
      gameId: '2',
      gameName: 'Ticket to Ride',
      gameImage: 'https://images.pexels.com/photos/4691567/pexels-photo-4691567.jpeg',
      currentPrice: 35.00,
      endTime: '2024-05-21T20:00:00Z',
      condition: 'new',
      bids: 3,
      watchers: 8,
      seller: {
        id: '2',
        name: 'Jane Smith',
        rating: 4.9,
        totalSales: 32
      }
    }
  ];

  const filterOptions = {
    condition: [
      { id: 'new', label: 'New', count: 15 },
      { id: 'like_new', label: 'Like New', count: 23 },
      { id: 'very_good', label: 'Very Good', count: 45 },
      { id: 'good', label: 'Good', count: 32 },
      { id: 'acceptable', label: 'Acceptable', count: 18 }
    ],
    priceRange: [
      { id: '0-25', label: 'Under $25', count: 42 },
      { id: '25-50', label: '$25 to $50', count: 56 },
      { id: '50-100', label: '$50 to $100', count: 34 },
      { id: '100+', label: 'Over $100', count: 12 }
    ],
    category: [
      { id: 'strategy', label: 'Strategy', count: 89 },
      { id: 'family', label: 'Family', count: 67 },
      { id: 'party', label: 'Party', count: 45 },
      { id: 'card_game', label: 'Card Game', count: 34 }
    ]
  };

  const sortOptions = [
    { value: 'ending_soon', label: 'Ending Soon' },
    { value: 'newly_listed', label: 'Newly Listed' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'most_bids', label: 'Most Bids' }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Banner 
          title="Board Game Marketplace" 
          subtitle="Buy and sell board games through auctions" 
          image="https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg"
        />
        
        <div className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search auctions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </form>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-50"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>

              <Link
                to="/marketplace/new"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Auction
              </Link>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Filters Panel */}
            {showFilters && (
              <div className="w-64 flex-shrink-0">
                <FilterPanel
                  filterGroups={[
                    {
                      id: 'condition',
                      title: 'Condition',
                      options: filterOptions.condition
                    },
                    {
                      id: 'priceRange',
                      title: 'Price Range',
                      options: filterOptions.priceRange
                    },
                    {
                      id: 'category',
                      title: 'Category',
                      options: filterOptions.category
                    }
                  ]}
                  selectedFilters={{
                    condition: selectedConditions,
                    priceRange: selectedPriceRanges,
                    category: selectedCategories
                  }}
                  onFilterChange={setFilterValues}
                  sortOptions={sortOptions}
                  selectedSort="ending_soon"
                  onSortChange={(value) => console.log('Sort changed:', value)}
                />
              </div>
            )}

            {/* Auctions Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {auctions.map(auction => (
                  <AuctionCard
                    key={auction.id}
                    auction={auction}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MarketplacePage;