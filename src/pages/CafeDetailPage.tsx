import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { MapPin, Clock, DollarSign, Package, Calendar, Heart, Users, ThumbsUp, MessageSquare, Share2, Search } from 'lucide-react';
import { Cafe, Event } from '../types';
import EventCard from '../components/cards/EventCard';
import Rating from '../components/common/Rating';
import { toast } from 'react-hot-toast';
import { useAuth } from '../components/providers/AuthProvider';
import Tabs from '../components/common/Tabs';
import CreateEventModal from '../components/modals/CreateEventModal';
import BulletinModal from '../components/common/BulletinModal';
import ContentList from '../components/common/ContentList';
import ShareButtons from '../components/common/ShareButtons';

interface BoardGame {
  id: string;
  name: string;
  image: string;
  playerCount: string;
  playTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  available: boolean;
  rentPrice: number;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Drinks' | 'Snacks' | 'Meals' | 'Desserts';
  image?: string;
  isPopular?: boolean;
  isVegetarian?: boolean;
}

const CafeDetailPage: React.FC = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [selectedBlogPost, setSelectedBlogPost] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGameCategory, setSelectedGameCategory] = useState<string>('all');
  const [selectedMenuCategory, setSelectedMenuCategory] = useState<string>('all');

  // Mock data for the cafe
  const cafe: Cafe = {
    id: '1',
    name: 'Meeple\'s Corner',
    location: 'Downtown',
    address: '123 Main St',
    openingHours: {
      weekdays: '10:00 AM - 11:00 PM',
      weekends: '9:00 AM - 12:00 AM',
      holidays: '10:00 AM - 10:00 PM'
    },
    averageBudget: '$15-25',
    boardGameCount: 300,
    eventCount: 5,
    isFollowing: false,
    image: 'https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg'
  };

  // Mock data for board games
  const boardGames: BoardGame[] = [
    {
      id: '1',
      name: 'Catan',
      image: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
      playerCount: '3-4',
      playTime: '60-120 min',
      difficulty: 'Medium',
      available: true,
      rentPrice: 5
    },
    {
      id: '2',
      name: 'Ticket to Ride',
      image: 'https://images.pexels.com/photos/4691567/pexels-photo-4691567.jpeg',
      playerCount: '2-5',
      playTime: '30-60 min',
      difficulty: 'Easy',
      available: true,
      rentPrice: 5
    },
    {
      id: '3',
      name: 'Pandemic',
      image: 'https://images.pexels.com/photos/1329545/pexels-photo-1329545.jpeg',
      playerCount: '2-4',
      playTime: '45-60 min',
      difficulty: 'Medium',
      available: false,
      rentPrice: 5
    }
  ];

  // Mock data for menu items
  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Cappuccino',
      description: 'Rich espresso topped with foamy milk',
      price: 4.50,
      category: 'Drinks',
      image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg',
      isPopular: true
    },
    {
      id: '2',
      name: 'Nachos',
      description: 'Tortilla chips with melted cheese, jalapeños, and salsa',
      price: 8.99,
      category: 'Snacks',
      image: 'https://images.pexels.com/photos/1108775/pexels-photo-1108775.jpeg',
      isVegetarian: true
    },
    {
      id: '3',
      name: 'Chicken Sandwich',
      description: 'Grilled chicken with lettuce, tomato, and mayo',
      price: 12.99,
      category: 'Meals',
      image: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg'
    },
    {
      id: '4',
      name: 'Chocolate Brownie',
      description: 'Warm chocolate brownie with vanilla ice cream',
      price: 6.99,
      category: 'Desserts',
      image: 'https://images.pexels.com/photos/45202/brownie-dessert-cake-sweet-45202.jpeg',
      isPopular: true
    }
  ];

  const upcomingEvents: Event[] = [
    {
      id: '1',
      name: 'Board Game Night',
      description: 'Join us for a night of board games!',
      date: '2024-05-20 19:00',
      location: 'Meeple\'s Corner',
      address: '123 Main St',
      status: 'recruiting',
      participantCount: 5,
      maxParticipants: 10,
      cost: '5',
      organizer: 'John Doe',
      boardGames: ['Catan', 'Ticket to Ride']
    },
    {
      id: '2',
      name: 'Weekend Tournament',
      description: 'Competitive board gaming tournament with prizes!',
      date: '2024-05-25 14:00',
      location: 'Meeple\'s Corner',
      address: '123 Main St',
      status: 'recruiting',
      participantCount: 8,
      maxParticipants: 16,
      cost: '10',
      organizer: 'Jane Smith',
      boardGames: ['Chess', 'Go']
    }
  ];

  const blogPosts = [
    {
      id: '1',
      title: 'New Games Added to Our Collection',
      content: 'We\'re excited to announce that we\'ve added 20 new games to our collection this month. These include popular titles like Wingspan, Everdell, and Root. Come check them out!',
      author: {
        name: 'Sarah Johnson',
        role: 'Game Master',
        image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg'
      },
      date: 'May 15, 2024',
      likes: 24,
      comments: [
        {
          id: '1',
          author: {
            name: 'Mike Wilson',
            image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
            role: 'member'
          },
          content: 'Can\'t wait to try Wingspan!',
          timestamp: '2 hours ago',
          likes: 3
        }
      ],
      image: 'https://images.pexels.com/photos/4691567/pexels-photo-4691567.jpeg'
    }
  ];

  const questions = [
    {
      id: '1',
      author: {
        name: 'Mike Wilson',
        image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
        role: 'member'
      },
      content: 'Do you have any specific events for beginners?',
      timestamp: '2024-05-10',
      likes: 5,
      replies: [
        {
          id: '1',
          author: {
            name: 'Cafe Staff',
            image: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg',
            role: 'admin'
          },
          content: 'Yes, we host beginner-friendly game nights every Wednesday!',
          timestamp: '2024-05-10',
          likes: 2
        }
      ]
    }
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: cafe.name,
        text: `Check out ${cafe.name} on BoardHaven!`,
        url: window.location.href
      }).catch(() => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleRatingChange = (value: number) => {
    if (!isAuthenticated) {
      toast.error('Please log in to rate this cafe');
      return;
    }
    setUserRating(value);
    toast.success('Rating updated successfully');
  };

  const filteredBoardGames = boardGames.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedGameCategory === 'all' || 
      (selectedGameCategory === 'available' && game.available) ||
      (selectedGameCategory === 'unavailable' && !game.available);
    return matchesSearch && matchesCategory;
  });

  const filteredMenuItems = menuItems.filter(item => {
    return selectedMenuCategory === 'all' || item.category.toLowerCase() === selectedMenuCategory;
  });

  const tabs = [
    {
      id: 'summary',
      label: 'Summary',
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Opening Hours</h2>
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">Weekdays</div>
                <div className="text-gray-600">{cafe.openingHours.weekdays}</div>
              </div>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">Weekends</div>
                <div className="text-gray-600">{cafe.openingHours.weekends}</div>
              </div>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">Holidays</div>
                <div className="text-gray-600">{cafe.openingHours.holidays}</div>
              </div>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <h2 className="text-2xl font-semibold mb-4">Amenities & Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Game Rentals</h3>
              <p className="text-gray-600">
                Rent from our collection of over 300 board games. Rental fee: $5 per game for up to 4 hours.
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Food & Drinks</h3>
              <p className="text-gray-600">
                Full café menu with coffee, tea, snacks, and light meals. Special game night menu available.
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Event Space</h3>
              <p className="text-gray-600">
                Private rooms available for parties and events. Capacity: up to 20 people.
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Game Teaching</h3>
              <p className="text-gray-600">
                Our staff can teach you new games. Free game tutorials every Saturday.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'events',
      label: 'Events',
      content: (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Upcoming Events</h2>
            {isAuthenticated && (
              <button
                onClick={() => setShowCreateEventModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Event
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingEvents.map(event => (
              <EventCard 
                key={event.id}
                event={event}
                showJoinButton={true}
              />
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'staff-blog',
      label: 'Staff Blog',
      content: (
        <div className="space-y-6">
          {blogPosts.map(post => (
            <div 
              key={post.id} 
              className="bg-white border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedBlogPost(post)}
            >
              {post.image && (
                <img 
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <div className="flex items-center mb-4">
                  <img 
                    src={post.author.image}
                    alt={post.author.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="ml-3">
                    <div className="font-medium">{post.author.name}</div>
                    <div className="text-sm text-gray-500">{post.author.role}</div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.content}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center">
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      <span>{post.comments.length}</span>
                    </button>
                  </div>
                  <span>{post.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'questions',
      label: 'Questions',
      content: (
        <ContentList
          items={questions}
          type="question"
          onLike={(id) => console.log('Like question:', id)}
          onReply={(id, content) => console.log('Reply to question:', id, content)}
          onDelete={(id) => console.log('Delete question:', id)}
          userRole="member"
        />
      )
    },
    {
      id: 'board-games',
      label: 'Board Games',
      content: (
        <div>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedGameCategory('all')}
                className={`px-3 py-1 rounded-md ${
                  selectedGameCategory === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedGameCategory('available')}
                className={`px-3 py-1 rounded-md ${
                  selectedGameCategory === 'available'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Available
              </button>
              <button
                onClick={() => setSelectedGameCategory('unavailable')}
                className={`px-3 py-1 rounded-md ${
                  selectedGameCategory === 'unavailable'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Unavailable
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBoardGames.map(game => (
              <div key={game.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={game.image}
                  alt={game.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{game.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-sm ${
                      game.available
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {game.available ? 'Available' : 'In Use'}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Players:</span>
                      <span>{game.playerCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Play Time:</span>
                      <span>{game.playTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Difficulty:</span>
                      <span>{game.difficulty}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Rental Fee:</span>
                      <span>${game.rentPrice.toFixed(2)}/session</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'menu',
      label: 'Menu',
      content: (
        <div>
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSelectedMenuCategory('all')}
              className={`px-3 py-1 rounded-md ${
                selectedMenuCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {['drinks', 'snacks', 'meals', 'desserts'].map(category => (
              <button
                key={category}
                onClick={() => setSelectedMenuCategory(category)}
                className={`px-3 py-1 rounded-md ${
                  selectedMenuCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredMenuItems.map(item => (
              <div key={item.id} className="flex bg-white rounded-lg shadow-md overflow-hidden">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-32 h-32 object-cover"
                  />
                )}
                <div className="flex-1 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <span className="font-medium">${item.price.toFixed(2)}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.isPopular && (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-800">
                        Popular
                      </span>
                    )}
                    {item.isVegetarian && (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
                        Vegetarian
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Hero Section */}
          <div className="relative h-96">
            <img 
              src={cafe.image} 
              alt={cafe.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-full text-sm bg-blue-100 text-blue-800">
                  {cafe.location}
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-2">{cafe.name}</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Package className="w-4 h-4 mr-1" />
                  <span>{cafe.boardGameCount} games</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{cafe.eventCount} upcoming events</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Rating
                  value={userRating || 4.5}
                  onChange={handleRatingChange}
                  size={24}
                  readonly={!isAuthenticated}
                />
                <span>({userRating || 4.5})</span>
              </div>
              <div className="flex items-center space-x-4">
                <ShareButtons
                  url={window.location.href}
                  title={`Check out ${cafe.name} on BoardHaven!`}
                />
                <button
                  onClick={handleShare}
                  className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </button>
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                    isFollowing ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Heart className={`w-5 h-5 mr-2 ${isFollowing ? 'fill-white' : ''}`} />
                  <span>{isFollowing ? 'Following' : 'Follow'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <Tabs tabs={tabs} />
              </div>

              <div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Cafe Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500">Location</div>
                        <div className="font-medium">{cafe.location}</div>
                        <div className="text-sm text-gray-500">{cafe.address}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <DollarSign className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500">Average Budget</div>
                        <div className="font-medium">{cafe.averageBudget}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Package className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500">Board Games</div>
                        <div className="font-medium">{cafe.boardGameCount} games available</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                      Make a Reservation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <CreateEventModal
        isOpen={showCreateEventModal}
        onClose={() => setShowCreateEventModal(false)}
      />

      {selectedBlogPost && (
        <BulletinModal
          post={selectedBlogPost}
          onClose={() => setSelectedBlogPost(null)}
          userRole="member"
        />
      )}
    </div>
  );
};

export default CafeDetailPage;