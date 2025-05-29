import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Users, MapPin, Calendar, Trophy, MessageSquare, Package, BarChart as ChartBar, ThumbsUp, Plus, X } from 'lucide-react';
import { Community, Event, Game } from '../types';

type Tab = 'info' | 'events' | 'games' | 'bulletin' | 'survey';

interface Member {
  id: string;
  name: string;
  image: string;
  joinDate: string;
  role: 'admin' | 'moderator' | 'member';
  lastActive: string;
}

interface BulletinPost {
  id: string;
  author: {
    name: string;
    image: string;
    role: 'admin' | 'moderator' | 'member';
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  isPinned?: boolean;
}

interface Survey {
  id: string;
  title: string;
  description: string;
  endDate: string;
  totalVotes: number;
  isActive: boolean;
  options: {
    id: string;
    text: string;
    votes: number;
  }[];
}

const CommunityDetailPage: React.FC = () => {
  const { id } = useParams();
  const [isAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('info');
  const [showNewSurveyModal, setShowNewSurveyModal] = useState(false);
  const [showNewBulletinModal, setShowNewBulletinModal] = useState(false);
  const [newSurvey, setNewSurvey] = useState({
    title: '',
    description: '',
    endDate: '',
    options: ['', '']
  });
  const [newBulletin, setNewBulletin] = useState({
    content: '',
    isPinned: false
  });

  // Mock data - in production, fetch this based on the ID
  const community: Community = {
    id: '1',
    name: 'Strategy Gamers United',
    description: 'A community for strategy board game enthusiasts. We meet weekly to play games like Terraforming Mars, Scythe, and more. Our community focuses on creating a welcoming environment for both newcomers and experienced players.',
    city: 'New York',
    memberCount: 156,
    lastActive: '2 hours ago',
    activities: ['Strategy Games', 'Tournaments', 'Game Nights', 'Learning Sessions', 'Social Events'],
    administrator: 'Sarah Johnson',
    mainArea: 'Manhattan',
    mainLocations: ['Central Park', 'Board Game Cafe Downtown', 'Community Center'],
    image: 'https://images.pexels.com/photos/7594067/pexels-photo-7594067.jpeg'
  };

  // Mock data for new members
  const recentMembers: Member[] = [
    {
      id: '1',
      name: 'John Smith',
      image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
      joinDate: '2 days ago',
      role: 'member',
      lastActive: '1 hour ago'
    },
    {
      id: '2',
      name: 'Emma Wilson',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
      joinDate: '3 days ago',
      role: 'moderator',
      lastActive: '30 minutes ago'
    },
    {
      id: '3',
      name: 'Michael Brown',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      joinDate: '5 days ago',
      role: 'member',
      lastActive: '2 hours ago'
    }
  ];

  // Mock data for events
  const events: Event[] = [
    {
      id: '1',
      name: 'Weekly Strategy Night',
      description: 'Join us for our weekly strategy game night!',
      date: '2024-03-25 19:00',
      location: 'Board Game Cafe Downtown',
      address: '123 Main St',
      status: 'recruiting',
      participantCount: 8,
      maxParticipants: 12,
      cost: 'free',
      organizer: 'Sarah Johnson',
      boardGames: ['Terraforming Mars', 'Scythe'],
      type: 'meetup',
      city: 'New York',
      image: 'https://images.pexels.com/photos/4691567/pexels-photo-4691567.jpeg'
    }
  ];

  // Mock data for games
  const games: Game[] = [
    {
      id: '1',
      name: 'Terraforming Mars',
      image: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
      description: 'Terraform Mars for human habitation in this strategic game.',
      categories: ['Strategy', 'Science Fiction'],
      publisher: 'FryxGames',
      ageRecommendation: '12+',
      playerCount: '1-5',
      mechanics: ['Card Drafting', 'Engine Building'],
      rating: 4.5,
      likes: 1250,
      owners: 3500,
      comments: 450
    }
  ];

  // Mock data for bulletin posts
  const bulletinPosts: BulletinPost[] = [
    {
      id: '1',
      author: {
        name: 'Sarah Johnson',
        image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
        role: 'admin'
      },
      content: 'Welcome to our new members! Don\'t forget to check out our weekly game nights every Thursday.',
      timestamp: '2 hours ago',
      likes: 15,
      comments: 3,
      isPinned: true
    }
  ];

  // Mock data for surveys
  const surveys: Survey[] = [
    {
      id: '1',
      title: 'Next Tournament Game',
      description: 'Help us choose the main game for our upcoming tournament!',
      endDate: '2024-03-30',
      totalVotes: 45,
      isActive: true,
      options: [
        { id: '1', text: 'Terraforming Mars', votes: 20 },
        { id: '2', text: 'Scythe', votes: 15 },
        { id: '3', text: 'Root', votes: 10 }
      ]
    }
  ];

  const handleAddSurveyOption = () => {
    setNewSurvey(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const handleRemoveSurveyOption = (index: number) => {
    setNewSurvey(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const handleSurveyOptionChange = (index: number, value: string) => {
    setNewSurvey(prev => ({
      ...prev,
      options: prev.options.map((option, i) => i === index ? value : option)
    }));
  };

  const handleSubmitSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle survey submission
    console.log('New survey:', newSurvey);
    setShowNewSurveyModal(false);
  };

  const handleSubmitBulletin = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle bulletin submission
    console.log('New bulletin:', newBulletin);
    setShowNewBulletinModal(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">About Our Community</h2>
              <p className="text-gray-600 mb-6">{community.description}</p>

              <h3 className="text-xl font-semibold mb-3">Activities</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {community.activities.map((activity, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {activity}
                  </span>
                ))}
              </div>

              <h3 className="text-xl font-semibold mb-3">Main Locations</h3>
              <div className="space-y-2">
                {community.mainLocations.map((location, index) => (
                  <div 
                    key={index}
                    className="flex items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                    <span>{location}</span>
                  </div>
                ))}
              </div>

              {/* New Members Section */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">New Members</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {recentMembers.map(member => (
                    <div key={member.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-gray-500">Joined {member.joinDate}</div>
                        <div className="flex items-center mt-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            member.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                            member.role === 'moderator' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {member.role}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">
                            Active {member.lastActive}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'events':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Community Events</h2>
              {isAuthenticated && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Create Event
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map(event => (
                <div key={event.id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{event.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      event.status === 'recruiting' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{event.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{event.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'games':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Community Games</h2>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                  Most Played
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                  Recently Added
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map(game => (
                <div key={game.id} className="bg-white p-4 rounded-lg shadow">
                  <img 
                    src={game.image} 
                    alt={game.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-semibold mb-2">{game.name}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <Package className="w-4 h-4 mr-1" />
                    <span>{game.owners} owners in community</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'bulletin':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Bulletin Board</h2>
              {isAuthenticated && (
                <button
                  onClick={() => setShowNewBulletinModal(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Post
                </button>
              )}
            </div>
            {bulletinPosts.map(post => (
              <div key={post.id} className={`bg-white p-4 rounded-lg shadow ${post.isPinned ? 'border-l-4 border-blue-500' : ''}`}>
                {post.isPinned && (
                  <div className="text-sm text-blue-600 mb-2">📌 Pinned Post</div>
                )}
                <div className="flex items-center mb-3">
                  <img 
                    src={post.author.image} 
                    alt={post.author.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="ml-3">
                    <div className="font-medium">{post.author.name}</div>
                    <div className="text-sm text-gray-500">{post.timestamp}</div>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{post.content}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <button className="flex items-center mr-4">
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    {post.likes}
                  </button>
                  <button className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    {post.comments}
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      case 'survey':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Community Surveys</h2>
              {isAuthenticated && (
                <button
                  onClick={() => setShowNewSurveyModal(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Survey
                </button>
              )}
            </div>
            {surveys.map(survey => (
              <div key={survey.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{survey.title}</h3>
                    <p className="text-gray-600">{survey.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    survey.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {survey.isActive ? 'Active' : 'Closed'}
                  </span>
                </div>
                <div className="space-y-4 mt-6">
                  {survey.options.map(option => {
                    const percentage = Math.round((option.votes / survey.totalVotes) * 100);
                    return (
                      <div key={option.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{option.text}</span>
                          <span>{percentage}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="text-sm text-gray-500">
                          {option.votes} votes
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-6 text-sm text-gray-500">
                  Total votes: {survey.totalVotes} • Ends on {survey.endDate}
                </div>
                {survey.isActive && isAuthenticated && (
                  <button className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Cast Your Vote
                  </button>
                )}
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAuthenticated={isAuthenticated} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Hero Section */}
          <div className="relative h-96">
            <img 
              src={community.image} 
              alt={community.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-full text-sm bg-blue-100 text-blue-800">
                  {community.city}
                </span>
                <span className="px-2 py-0.5 rounded-full text-sm bg-green-100 text-green-800">
                  {community.mainArea}
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-2">{community.name}</h1>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{community.memberCount} members</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Last active: {community.lastActive}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'info'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Info
                </button>
                <button
                  onClick={() => setActiveTab('events')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'events'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Events
                </button>
                <button
                  onClick={() => setActiveTab('games')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'games'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Games
                </button>
                <button
                  onClick={() => setActiveTab('bulletin')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'bulletin'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Bulletin Board
                </button>
                <button
                  onClick={() => setActiveTab('survey')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'survey'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Surveys
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            {renderTabContent()}
          </div>
        </div>
      </main>

      {/* New Survey Modal */}
      {showNewSurveyModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowNewSurveyModal(false)}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Create New Survey</h3>
                  <button
                    onClick={() => setShowNewSurveyModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmitSurvey}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Title</label>
                      <input
                        type="text"
                        value={newSurvey.title}
                        onChange={(e) => setNewSurvey(prev => ({ ...prev, title: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        value={newSurvey.description}
                        onChange={(e) => setNewSurvey(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">End Date</label>
                      <input
                        type="date"
                        value={newSurvey.endDate}
                        onChange={(e) => setNewSurvey(prev => ({ ...prev, endDate: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                      {newSurvey.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2 mb-2">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => handleSurveyOptionChange(index, e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder={`Option ${index + 1}`}
                            required
                          />
                          {index >= 2 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveSurveyOption(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={handleAddSurveyOption}
                        className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                      >
                        + Add Option
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 sm:mt-6">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                    >
                      Create Survey
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Bulletin Modal */}
      {showNewBulletinModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowNewBulletinModal(false)}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Create New Post</h3>
                  <button
                    onClick={() => setShowNewBulletinModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmitBulletin}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Content</label>
                      <textarea
                        value={newBulletin.content}
                        onChange={(e) => setNewBulletin(prev => ({ ...prev, content: e.target.value }))}
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="pin-post"
                        checked={newBulletin.isPinned}
                        onChange={(e) => setNewBulletin(prev => ({ ...prev, isPinned: e.target.checked }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="pin-post" className="ml-2 block text-sm text-gray-700">
                        Pin this post
                      </label>
                    </div>
                  </div>

                  <div className="mt-5 sm:mt-6">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                    >
                      Post
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityDetailPage;