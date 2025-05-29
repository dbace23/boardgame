import React, { useState } from 'react';
import { Star, ThumbsUp, Users, MessageSquare, X, Package } from 'lucide-react';
import { Game } from '../types';
import { Link } from 'react-router-dom';

interface GameCardProps {
  game: Game;
  isAuthenticated?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ game, isAuthenticated = false }) => {
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [isOwned, setIsOwned] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [postType, setPostType] = useState<'review' | 'rules' | 'tips' | 'replay' | 'rant'>('review');
  const [userRating, setUserRating] = useState<number | null>(null);
  const [isRatingHover, setIsRatingHover] = useState<number | null>(null);
  
  // Function to render star rating
  const renderStars = (rating: number, interactive: boolean = false) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (interactive) {
        stars.push(
          <Star
            key={i}
            className={`w-4 h-4 cursor-pointer ${
              (isRatingHover || userRating) && i <= (isRatingHover || userRating || 0)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-yellow-400'
            }`}
            onMouseEnter={() => setIsRatingHover(i)}
            onMouseLeave={() => setIsRatingHover(null)}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (isAuthenticated) {
                setUserRating(i);
              } else {
                window.location.href = '/login';
              }
            }}
          />
        );
      } else {
        if (i <= fullStars) {
          stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
        } else if (i === fullStars + 1 && hasHalfStar) {
          stars.push(
            <div key={i} className="relative">
              <Star className="w-4 h-4 text-yellow-400" />
              <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              </div>
            </div>
          );
        } else {
          stars.push(<Star key={i} className="w-4 h-4 text-yellow-400" />);
        }
      }
    }
    
    return stars;
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    setIsLiked(!isLiked);
  };

  const handleOwnClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    setIsOwned(!isOwned);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle comment submission here
    console.log('Comment submitted:', { comment, postType });
    setComment('');
    setShowCommentModal(false);
  };

  return (
    <>
      <Link to={`/game/${game.id}`} className="group">
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
          <div className="relative pb-[66.66%] overflow-hidden">
            <img 
              src={game.image} 
              alt={game.name} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{game.name}</h3>
              <div className="flex items-center">
                {renderStars(userRating || game.rating, isAuthenticated)}
                <span className="ml-1 text-sm text-gray-600">({game.rating.toFixed(1)})</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <button
                onClick={handleLikeClick}
                className={`flex items-center px-2 py-1 rounded-md transition-colors ${
                  isLiked ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <ThumbsUp className={`w-4 h-4 mr-1 ${isLiked ? 'fill-blue-600' : ''}`} />
                <span>{isLiked ? game.likes + 1 : game.likes}</span>
              </button>
              
              <button
                onClick={handleOwnClick}
                className={`flex items-center px-2 py-1 rounded-md transition-colors ${
                  isOwned ? 'text-green-600 bg-green-50' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Package className={`w-4 h-4 mr-1 ${isOwned ? 'fill-green-600' : ''}`} />
                <span>{isOwned ? 'Owned' : 'Own it?'}</span>
              </button>
              
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShowCommentModal(true);
                }}
                className="flex items-center px-2 py-1 rounded-md text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <MessageSquare className="w-4 h-4 mr-1" />
                <span>{game.comments}</span>
              </button>
            </div>
          </div>
        </div>
      </Link>

      {/* Comment Modal */}
      {showCommentModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="comment-modal">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
              onClick={() => setShowCommentModal(false)}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              {isAuthenticated ? (
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Add Comment for {game.name}
                    </h3>
                    <button
                      onClick={() => setShowCommentModal(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCommentSubmit}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Post Type
                      </label>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {['review', 'rules', 'tips', 'replay', 'rant'].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setPostType(type as any)}
                            className={`px-3 py-2 text-sm font-medium rounded-md capitalize ${
                              postType === type
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      rows={4}
                      placeholder={`Write your ${postType}...`}
                    ></textarea>
                    
                    <div className="mt-4 flex justify-end">
                      <button
                        type="submit"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Post {postType}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="bg-white px-4 py-6 sm:p-6 text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Join the Community
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Please log in or register to share your thoughts about {game.name}
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Link
                      to="/login"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Log In
                    </Link>
                    <Link
                      to="/register"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GameCard;