import React from 'react';
import { ThumbsUp, Package, MessageSquare, Flag } from 'lucide-react';
import { cn } from '../../utils/cn';

interface InteractionButtonsProps {
  likes: number;
  comments: number;
  isLiked?: boolean;
  isOwned?: boolean;
  onLike?: (e?: React.MouseEvent) => void;
  onOwn?: (e?: React.MouseEvent) => void;
  onComment?: (e?: React.MouseEvent) => void;
  onReport?: (e?: React.MouseEvent) => void;
  showReport?: boolean;
  variant?: 'default' | 'compact' | 'large';
  className?: string;
}

const InteractionButtons: React.FC<InteractionButtonsProps> = ({
  likes,
  comments,
  isLiked = false,
  isOwned = false,
  onLike,
  onOwn,
  onComment,
  onReport,
  showReport = true,
  variant = 'default',
  className = ''
}) => {
  const buttonStyles = {
    default: {
      container: 'flex items-center justify-between text-sm',
      button: 'flex items-center px-2 py-1 rounded-md transition-colors',
      icon: 'w-4 h-4 mr-1'
    },
    compact: {
      container: 'flex items-center space-x-2 text-xs',
      button: 'flex items-center transition-colors',
      icon: 'w-3 h-3 mr-0.5'
    },
    large: {
      container: 'flex items-center space-x-4',
      button: 'flex items-center px-4 py-2 rounded-md transition-colors',
      icon: 'w-5 h-5 mr-2'
    }
  };

  const styles = buttonStyles[variant];

  return (
    <div className={cn(styles.container, className)}>
      <button
        onClick={onLike}
        className={cn(
          styles.button,
          isLiked ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
        )}
      >
        <ThumbsUp className={cn(styles.icon, isLiked && 'fill-blue-600')} />
        <span>{isLiked ? likes + 1 : likes}</span>
      </button>
      
      {onOwn && (
        <button
          onClick={onOwn}
          className={cn(
            styles.button,
            isOwned ? 'text-green-600 bg-green-50' : 'text-gray-600 hover:bg-gray-50'
          )}
        >
          <Package className={cn(styles.icon, isOwned && 'fill-green-600')} />
          <span>{isOwned ? 'Owned' : 'Own it?'}</span>
        </button>
      )}
      
      {onComment && (
        <button
          onClick={onComment}
          className={cn(styles.button, 'text-gray-600 hover:bg-gray-50')}
        >
          <MessageSquare className={styles.icon} />
          <span>{comments}</span>
        </button>
      )}
      
      {showReport && onReport && (
        <button
          onClick={onReport}
          className={cn(styles.button, 'text-gray-400 hover:text-red-500 hover:bg-gray-50')}
          title="Report"
        >
          <Flag className={styles.icon} />
        </button>
      )}
    </div>
  );
};

export default InteractionButtons;