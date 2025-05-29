import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import Navbar from '../components/layout/Navbar';
import { Star, ThumbsUp, Users, MessageSquare, Package, ChevronDown, ChevronUp, Store, Users2, Edit2, Send, Flag } from 'lucide-react';
import { Game, PLACEHOLDER_IMAGES } from '../types';
import { toast } from 'react-hot-toast';
import Rating from '../components/common/Rating';
import ShareButtons from '../components/common/ShareButtons';
import ImageUpload from '../components/common/ImageUpload';
import { useAuth } from '../components/providers/AuthProvider';
import GameCard from '../components/cards/GameCard';
import { supabase } from '../lib/supabase';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

type Tab = 'comments' | 'tips' | 'rules' | 'reviews';

interface Comment {
  id: string;
  author: {
    name: string;
    image: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  rating?: number;
}

const GameDetailPage: React.FC = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingMechanics, setIsEditingMechanics] = useState(false);
  const [isEditingCategories, setIsEditingCategories] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [description, setDescription] = useState('Trade, build and settle the island of Catan in this award-winning strategy game. Collect resources, build roads and cities, and trade with other players to become the dominant force on Catan. Perfect for both casual and serious gamers.');
  const [showShops, setShowShops] = useState(false);
  const [showCommunities, setShowCommunities] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('comments');
  const [isLiked, setIsLiked] = useState(false);
  const [isOwned, setIsOwned] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [newComment, setNewComment] = useState('');
  const [gameInfo, setGameInfo] = useState({
    publisher: 'Kosmos',
    ageRecommendation: '10+',
    playerCount: '3-4'
  });
  const [mechanics, setMechanics] = useState(['Dice Rolling', 'Trading']);
  const [categories, setCategories] = useState(['Strategy', 'Family']);
  const [evaluation, setEvaluation] = useState({
    luck: 3.5,
    strategy: 4.2,
    negotiation: 4.8,
    mindGames: 3.9,
    offense: 4.0,
    appearance: 4.5
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const { data, error } = await supabase
          .from('games')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data) {
          setDescription(data.description || description);
          setGameInfo({
            publisher: data.publisher || gameInfo.publisher,
            ageRecommendation: data.age_recommendation || gameInfo.ageRecommendation,
            playerCount: data.player_count || gameInfo.playerCount
          });
          setMechanics(data.mechanics || mechanics);
          setCategories(data.categories || categories);
          setUserRating(data.rating || null);
        }
      } catch (err) {
        console.error('Error fetching game:', err);
        setError('Failed to load game details');
        toast.error('Failed to load game details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchGame();
    }
  }, [id]);

  // Similar games
  const similarGames: Game[] = [
    {
      id: '2',
      name: 'Ticket to Ride',
      image: 'https://images.pexels.com/photos/4691567/pexels-photo-4691567.jpeg',
      description: 'Cross country train adventure game.',
      categories: ['Family', 'Strategy'],
      publisher: 'Days of Wonder',
      ageRecommendation: '8+',
      playerCount: '2-5',
      mechanics: ['Set Collection', 'Route Building'],
      rating: 4.5,
      likes: 1932,
      owners: 7541,
      comments: 1021
    },
    {
      id: '3',
      name: 'Pandemic',
      image: 'https://images.pexels.com/photos/1329545/pexels-photo-1329545.jpeg',
      description: 'Cooperative disease fighting game.',
      categories: ['Strategy', 'Cooperative'],
      publisher: 'Z-Man Games',
      ageRecommendation: '8+',
      playerCount: '2-4',
      mechanics: ['Cooperative', 'Hand Management'],
      rating: 4.7,
      likes: 2156,
      owners: 6982,
      comments: 1521
    }
  ];

  const handleRatingChange = async (rating: number) => {
    if (!isAuthenticated) {
      toast.error('Please log in to rate this game');
      return;
    }

    try {
      const { error } = await supabase
        .from('ratings')
        .upsert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          entity_id: id,
          entity_type: 'game',
          rating
        });

      if (error) throw error;

      setUserRating(rating);
      toast.success('Rating submitted successfully!');
    } catch (err) {
      console.error('Error submitting rating:', err);
      toast.error('Failed to submit rating');
    }
  };

  const handleLikeToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to like this game');
      return;
    }

    try {
      const newLikeStatus = !isLiked;
      const { error } = await supabase
        .from('games')
        .update({ likes: newLikeStatus ? 'likes + 1' : 'likes - 1' })
        .eq('id', id);

      if (error) throw error;

      setIsLiked(newLikeStatus);
      toast.success(newLikeStatus ? 'Game liked!' : 'Game unliked');
    } catch (err) {
      console.error('Error toggling like:', err);
      toast.error('Failed to update like status');
    }
  };

  const handleOwnToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to mark ownership');
      return;
    }

    try {
      const newOwnStatus = !isOwned;
      const { error } = await supabase
        .from('games')
        .update({ owners: newOwnStatus ? 'owners + 1' : 'owners - 1' })
        .eq('id', id);

      if (error) throw error;

      setIsOwned(newOwnStatus);
      toast.success(newOwnStatus ? 'Game added to collection!' : 'Game removed from collection');
    } catch (err) {
      console.error('Error toggling ownership:', err);
      toast.error('Failed to update ownership status');
    }
  };

  const handleSaveDescription = async () => {
    try {
      const { error } = await supabase
        .from('games')
        .update({ description })
        .eq('id', id);

      if (error) throw error;

      toast.success('Description updated successfully!');
      setIsEditingDescription(false);
    } catch (err) {
      console.error('Error updating description:', err);
      toast.error('Failed to update description');
    }
  };

  const handleSaveMechanics = async () => {
    try {
      const { error } = await supabase
        .from('games')
        .update({ mechanics })
        .eq('id', id);

      if (error) throw error;

      toast.success('Game mechanics updated successfully!');
      setIsEditingMechanics(false);
    } catch (err) {
      console.error('Error updating mechanics:', err);
      toast.error('Failed to update mechanics');
    }
  };

  const handleSaveCategories = async () => {
    try {
      const { error } = await supabase
        .from('games')
        .update({ categories })
        .eq('id', id);

      if (error) throw error;

      toast.success('Categories updated successfully!');
      setIsEditingCategories(false);
    } catch (err) {
      console.error('Error updating categories:', err);
      toast.error('Failed to update categories');
    }
  };

  const handleSaveInfo = async () => {
    try {
      const { error } = await supabase
        .from('games')
        .update({
          publisher: gameInfo.publisher,
          age_recommendation: gameInfo.ageRecommendation,
          player_count: gameInfo.playerCount
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Game information updated successfully!');
      setIsEditingInfo(false);
    } catch (err) {
      console.error('Error updating game info:', err);
      toast.error('Failed to update game information');
    }
  };

  const handleEvaluationChange = (aspect: keyof typeof evaluation, value: number) => {
    if (!isAuthenticated) {
      toast.error('Please log in to evaluate the game');
      return;
    }
    setEvaluation(prev => ({
      ...prev,
      [aspect]: value
    }));
    toast.success('Evaluation updated!');
  };

  const evaluationData = {
    labels: [
      'Luck & Probability',
      'Strategy',
      'Negotiations',
      'Mind Games',
      'Offense/Defense',
      'Art & Appearance'
    ],
    datasets: [
      {
        label: 'Game Evaluation',
        data: [
          evaluation.luck,
          evaluation.strategy,
          evaluation.negotiation,
          evaluation.mindGames,
          evaluation.offense,
          evaluation.appearance
        ],
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        borderColor: 'rgba(37, 99, 235, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(37, 99, 235, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(37, 99, 235, 1)'
      }
    ]
  };

  const evaluationOptions = {
    scales: {
      r: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Game</h2>
          <p className="text-gray-600">{error}</p>
          <Link to="/" className="mt-4 inline-block text-blue-600 hover:text-blue-700">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAuthenticated={isAuthenticated} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-72 sm:h-96">
            {isAuthenticated && (
              <div className="absolute top-4 right-4 z-10">
                <ImageUpload
                  onUploadComplete={(url) => toast.success('Image updated successfully!')}
                  defaultImage={PLACEHOLDER_IMAGES.GAME}
                />
              </div>
            )}
            <img 
              src={PLACEHOLDER_IMAGES.GAME}
              alt="Catan"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 sm:mb-0">Catan</h1>
                <div className="flex items-center space-x-4">
                  <Rating
                    value={userRating || 4.3}
                    onChange={handleRatingChange}
                    size={24}
                    readonly={!isAuthenticated}
                  />
                  <span className="text-white">({userRating || 4.3})</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-wrap gap-4 mb-6">
              <button
                onClick={handleLikeToggle}
                className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                  isLiked ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ThumbsUp className={`w-5 h-5 mr-2 ${isLiked ? 'fill-white' : ''}`} />
                <span>{isLiked ? '2,452 Likes' : '2,451 Likes'}</span>
              </button>
              
              <button
                onClick={handleOwnToggle}
                className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                  isOwned ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Package className={`w-5 h-5 mr-2 ${isOwned ? 'fill-white' : ''}`} />
                <span>{isOwned ? 'Owned' : 'Own it?'}</span>
              </button>

              <ShareButtons
                url={window.location.href}
                title="Check out Catan on BoardHaven!"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-2xl font-semibold">About the Game</h2>
                      {isAuthenticated && !isEditingDescription && (
                        <button
                          onClick={() => setIsEditingDescription(true)}
                          className="flex items-center text-blue-600 hover:text-blue-700"
                        >
                          <Edit2 className="w-4 h-4 mr-1.5" />
                          Edit
                        </button>
                      )}
                    </div>
                    
                    {isEditingDescription ? (
                      <div className="relative">
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows={6}
                        />
                        <div className="absolute bottom-3 right-3 flex space-x-2">
                          <button
                            onClick={() => setIsEditingDescription(false)}
                            className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveDescription}
                            className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                          >
                            <Send className="w-4 h-4 mr-1.5" />
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-600">{description}</p>
                    )}
                  </div>

                  {/* Game Mechanics */}
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold">Game Mechanics</h3>
                      {isAuthenticated && !isEditingMechanics && (
                        <button
                          onClick={() => setIsEditingMechanics(true)}
                          className="flex items-center text-blue-600 hover:text-blue-700"
                        >
                          <Edit2 className="w-4 h-4 mr-1.5" />
                          Edit
                        </button>
                      )}
                    </div>
                    
                    {isEditingMechanics ? (
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {mechanics.map((mechanic, index) => (
                            <div
                              key={index}
                              className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                            >
                              <span>{mechanic}</span>
                              <button
                                onClick={() => setMechanics(mechanics.filter((_, i) => i !== index))}
                                className="ml-2 text-blue-600 hover:text-blue-800"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            placeholder="Add mechanic..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                const input = e.target as HTMLInputElement;
                                if (input.value.trim()) {
                                  setMechanics([...mechanics, input.value.trim()]);
                                  input.value = '';
                                }
                              }
                            }}
                          />
                          <button
                            onClick={handleSaveMechanics}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {mechanics.map((mechanic, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {mechanic}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Categories */}
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold">Categories</h3>
                      {isAuthenticated && !isEditingCategories && (
                        <button
                          onClick={() => setIsEditingCategories(true)}
                          className="flex items-center text-blue-600 hover:text-blue-700"
                        >
                          <Edit2 className="w-4 h-4 mr-1.5" />
                          Edit
                        </button>
                      )}
                    </div>
                    
                    {isEditingCategories ? (
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {categories.map((category, index) => (
                            <div
                              key={index}
                              className="flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full"
                            >
                              <span>{category}</span>
                              <button
                                onClick={() => setCategories(categories.filter((_, i) => i !== index))}
                                className="ml-2 text-purple-600 hover:text-purple-800"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            placeholder="Add category..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                const input = e.target as HTMLInputElement;
                                if (input.value.trim()) {
                                  setCategories([...categories, input.value.trim()]);
                                  input.value = '';
                                }
                              }
                            }}
                          />
                          <button
                            onClick={handleSaveCategories}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {categories.map((category, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Game Evaluation */}
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">Game Evaluation</h2>
                    <div className="bg-white p-6 rounded-lg shadow">
                      <div className="max-w-md mx-auto">
                        <Radar data={evaluationData} options={evaluationOptions} />
                      </div>
                      {isAuthenticated && (
                        <div className="mt-6 space-y-4">
                          {Object.entries(evaluation).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between">
                              <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                              <input
                                type="range"
                                min="1"
                                max="5"
                                step="0.1"
                                value={value}
                                onChange={(e) => handleEvaluationChange(key as keyof typeof evaluation, parseFloat(e.target.value))}
                                className="w-48"
                              />
                              <span>{value.toFixed(1)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                {/* Game Information */}
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold">Game Information</h3>
                    {isAuthenticated && !isEditingInfo && (
                      <button
                        onClick={() => setIsEditingInfo(true)}
                        className="flex items-center text-blue-600 hover:text-blue-700"
                      >
                        <Edit2 className="w-4 h-4 mr-1.5" />
                        Edit
                      </button>
                    )}
                  </div>
                  
                  {isEditingInfo ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Publisher</label>
                        <input
                          type="text"
                          value={gameInfo.publisher}
                          onChange={(e) => setGameInfo({ ...gameInfo, publisher: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Age Recommendation</label>
                        <input
                          type="text"
                          value={gameInfo.ageRecommendation}
                          onChange={(e) => setGameInfo({ ...gameInfo, ageRecommendation: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Player Count</label>
                        <input
                          type="text"
                          value={gameInfo.playerCount}
                          onChange={(e) => setGameInfo({ ...gameInfo, playerCount: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <button
                        onClick={handleSaveInfo}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-gray-500">Publisher</div>
                        <div className="font-medium">{gameInfo.publisher}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Age Recommendation</div>
                        <div className="font-medium">{gameInfo.ageRecommendation}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Player Count</div>
                        <div className="font-medium">{gameInfo.playerCount}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="mt-8">
              <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8 overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('comments')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === 'comments'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Comments
                  </button>
                  <button
                    onClick={() => setActiveTab('tips')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === 'tips'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Tips
                  </button>
                  <button
                    onClick={() => setActiveTab('rules')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === 'rules'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Rules
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === 'reviews'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Reviews
                  </button>
                </nav>
              </div>

              {/* Comment Form */}
              {isAuthenticated && (
                <div className="mb-6">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={`Write your ${activeTab.slice(0, -1)}...`}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={4}
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={() => {
                        if (newComment.trim()) {
                          toast.success(`${activeTab.slice(0, -1)} posted successfully!`);
                          setNewComment('');
                        }
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Post {activeTab.slice(0, -1)}
                    </button>
                  </div>
                </div>
              )}

              {/* Comments Display */}
              <div className="space-y-6">
                {/* Example comments for each tab */}
                {activeTab === 'comments' && (
                  <>
                    <div className="bg-white p-4 rounded-lg shadow">
                      <div className="flex items-center mb-2">
                        <img
                          src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg"
                          alt="John Doe"
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <div>
                          <div className="font-medium">John Doe</div>
                          <div className="text-sm text-gray-500">2 days ago</div>
                        </div>
                      </div>
                      <p className="text-gray-700">Great game! Love the trading mechanics and player interaction.</p>
                    </div>
                    {/* Add more comments */}
                  </>
                )}
              </div>

              {/* Similar Games */}
              <div className="mt-12">
                <h2 className="text-2xl font-semibold mb-6">You Might Also Like</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {similarGames.map(game => (
                    <GameCard
                      key={game.id}
                      game={game}
                      isAuthenticated={isAuthenticated}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GameDetailPage;