import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Calendar, MapPin, Users, DollarSign, Clock, Info, Edit2, Send, MessageSquare, Star } from 'lucide-react';
import { Event } from '../types';
import EventCard from '../components/cards/EventCard';
import Rating from '../components/common/Rating';
import { toast } from 'react-hot-toast';
import { useAuth } from '../components/providers/AuthProvider';

interface Comment {
  id: string;
  author: {
    name: string;
    image: string;
  };
  content: string;
  timestamp: string;
  isQuestion: boolean;
}

const EventDetailPage: React.FC = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [newComment, setNewComment] = useState('');

  // Mock data - in production, fetch this based on the ID
  const [eventData, setEventData] = useState<Event>({
    id: '1',
    name: 'Catan Tournament',
    description: 'Join us for an exciting Catan tournament! All skill levels welcome. This tournament will feature both base game and Cities & Knights expansion rounds. Prizes for the top 3 players!',
    date: '2024-03-25 14:00',
    location: 'Board Game Cafe Downtown',
    address: '123 Main St, Downtown',
    status: 'recruiting',
    participantCount: 8,
    maxParticipants: 16,
    cost: '$$$',
    organizer: 'John Doe',
    boardGames: ['Catan', 'Catan: Cities & Knights'],
    type: 'competition',
    joinType: 'public',
    city: 'New York',
    image: 'https://images.pexels.com/photos/4691567/pexels-photo-4691567.jpeg',
    eventType: 'offline'
  });

  // Mock host data
  const hostData = {
    name: 'John Doe',
    image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
    eventsHosted: 15,
    averageRating: 4.8,
    totalParticipants: 180,
    successfulEvents: 14,
    memberSince: '2023-01-15'
  };

  // Mock comments
  const [comments] = useState<Comment[]>([
    {
      id: '1',
      author: {
        name: 'Alice Johnson',
        image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg'
      },
      content: 'Will beginners be welcome at this event?',
      timestamp: '2 days ago',
      isQuestion: true
    },
    {
      id: '2',
      author: {
        name: 'Bob Wilson',
        image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg'
      },
      content: 'Do we need to bring our own copy of the game?',
      timestamp: '1 day ago',
      isQuestion: true
    }
  ]);

  const isEventOver = new Date(eventData.date) < new Date();
  const isOrganizer = user?.id === 'mock-user-123'; // Replace with actual check

  const handleRatingChange = (rating: number) => {
    if (!isAuthenticated) {
      toast.error('Please log in to rate this event');
      return;
    }
    if (!isEventOver) {
      toast.error('You can only rate events after they are completed');
      return;
    }
    setUserRating(rating);
    toast.success('Rating submitted successfully!');
  };

  const handleSaveChanges = () => {
    toast.success('Event details updated successfully!');
    setIsEditing(false);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in to comment');
      return;
    }
    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }
    toast.success('Comment posted successfully!');
    setNewComment('');
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAuthenticated={isAuthenticated} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-96">
            <img 
              src={eventData.image} 
              alt={eventData.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded-full text-sm ${
                  eventData.status === 'recruiting' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {eventData.status === 'recruiting' ? 'Recruiting' : 'Full'}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-sm ${
                  eventData.type === 'competition' 
                    ? 'bg-orange-100 text-orange-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {eventData.type || 'Meetup'}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-sm ${
                  eventData.eventType === 'offline' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-teal-100 text-teal-800'
                }`}>
                  {eventData.eventType}
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-2">{eventData.name}</h1>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{eventData.date}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{eventData.city}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {isEventOver && (
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <Rating
                    value={userRating || 4.5}
                    onChange={handleRatingChange}
                    size={24}
                    readonly={!isAuthenticated || !isEventOver}
                  />
                  <span>({userRating || 4.5})</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="space-y-6">
                  {/* Event Details */}
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-2xl font-semibold">Event Details</h2>
                      {isOrganizer && !isEditing && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center text-blue-600 hover:text-blue-700"
                        >
                          <Edit2 className="w-4 h-4 mr-1.5" />
                          Edit
                        </button>
                      )}
                    </div>
                    
                    {isEditing ? (
                      <div className="space-y-4">
                        <textarea
                          value={eventData.description}
                          onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows={6}
                        />
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 text-gray-700 hover:text-gray-900"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveChanges}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-600 mb-6">{eventData.description}</p>
                    )}

                    <h3 className="text-xl font-semibold mb-3">Games</h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {eventData.boardGames.map((game, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {game}
                        </span>
                      ))}
                    </div>

                    {eventData.status === 'recruiting' && (
                      <button className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        Register for Event
                      </button>
                    )}
                  </div>

                  {/* Host Information */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">Hosted by</h3>
                    <div className="flex items-center mb-4">
                      <img
                        src={hostData.image}
                        alt={hostData.name}
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <div>
                        <div className="font-medium">{hostData.name}</div>
                        <div className="text-sm text-gray-500">Member since {hostData.memberSince}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Events Hosted</div>
                        <div className="font-medium">{hostData.eventsHosted}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Average Rating</div>
                        <div className="font-medium flex items-center">
                          {hostData.averageRating}
                          <Star className="w-4 h-4 text-yellow-400 ml-1" />
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Total Participants</div>
                        <div className="font-medium">{hostData.totalParticipants}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Successful Events</div>
                        <div className="font-medium">{hostData.successfulEvents}</div>
                      </div>
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Questions</h3>
                    
                    {/* Comment Form */}
                    {isAuthenticated && (
                      <form onSubmit={handleCommentSubmit} className="mb-6">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Ask a question about this event..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows={4}
                        />
                        <div className="mt-2 flex justify-end">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            Post Question
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Comments List */}
                    <div className="space-y-4">
                      {comments.map(comment => (
                        <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <img
                              src={comment.author.image}
                              alt={comment.author.name}
                              className="w-8 h-8 rounded-full mr-2"
                            />
                            <div>
                              <div className="font-medium">{comment.author.name}</div>
                              <div className="text-sm text-gray-500">{comment.timestamp}</div>
                            </div>
                          </div>
                          <p className="text-gray-700">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                {/* Event Information */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Event Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500">Date & Time</div>
                        <div className="font-medium">{eventData.date}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500">Location</div>
                        <div className="font-medium">{eventData.location}</div>
                        <div className="text-sm text-gray-500">{eventData.address}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500">Participants</div>
                        <div className="font-medium">
                          {eventData.participantCount}/{eventData.maxParticipants}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <DollarSign className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500">Cost</div>
                        <div className="font-medium">{renderCost(eventData.cost)}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Info className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500">Join Type</div>
                        <div className="font-medium capitalize">{eventData.joinType}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventDetailPage;