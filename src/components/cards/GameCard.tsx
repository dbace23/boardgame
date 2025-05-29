import React, { useState, useCallback } from 'react';
import { Star, ThumbsUp, Package, MessageSquare } from 'lucide-react';
import { Game } from '../../types';
import BaseCard from './BaseCard';
import ImageHeader from './ImageHeader';
import InteractionButtons from '../common/InteractionButtons';
import LoginModal from '../common/LoginModal';
import { useAuth } from '../../components/providers/AuthProvider';
import { toast } from 'react-hot-toast';

interface GameCardProps {
  game: Game;
  className?: string;
}

const GameCard: React.FC<GameCardProps> = ({ game, className = '' }) => {
  const { isAuthenticated } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [isOwned, setIsOwned] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginModalMessage, setLoginModalMessage] = useState('');

  const handleAction = useCallback((action: () => void, message: string) => {
    if (!isAuthenticated) {
      setLoginModalMessage(message);
      setShowLoginModal(true);
      return;
    }
    action();
  }, [isAuthenticated]);

  const handleLike = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    handleAction(
      () => {
        setIsLiked(prev => !prev);
        toast.success(isLiked ? 'Game unliked' : 'Game liked!');
      },
      'Please log in to like this game'
    );
  }, [handleAction, isLiked]);

  const handleOwn = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    handleAction(
      () => {
        setIsOwned(prev => !prev);
        toast.success(isOwned ? 'Game removed from collection' : 'Game added to collection!');
      },
      'Please log in to add this game to your collection'
    );
  }, [handleAction, isOwned]);

  const handleComment = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    handleAction(
      () => toast.success('Comment feature coming soon!'),
      'Please log in to comment on this game'
    );
  }, [handleAction]);

  return (
    <>
      <BaseCard id={game.id} linkTo={`/game/${game.id}`} className={`h-full ${className}`}>
        <div className="flex flex-col h-full">
          <ImageHeader image={game.image} alt={game.name} aspectRatio="square" />
          
          <div className="p-4 flex flex-col flex-grow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{game.name}</h3>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="ml-1 text-sm text-gray-600">{game.rating.toFixed(1)}</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">{game.description}</p>
            
            <InteractionButtons
              likes={game.likes}
              comments={game.comments}
              isLiked={isLiked}
              isOwned={isOwned}
              onLike={handleLike}
              onOwn={handleOwn}
              onComment={handleComment}
            />
          </div>
        </div>
      </BaseCard>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        message={loginModalMessage}
      />
    </>
  );
};

export default React.memo(GameCard);