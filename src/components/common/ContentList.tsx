import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ThumbsUp, MessageSquare, Star } from 'lucide-react';
import Rating from './Rating';

interface ContentItem {
  id: string;
  author: {
    name: string;
    image: string;
    role?: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  rating?: number;
  replies?: ContentItem[];
}

interface ContentListProps {
  items: ContentItem[];
  itemsPerPage?: number;
  filters?: {
    label: string;
    value: string;
  }[];
  onFilterChange?: (filter: string) => void;
  renderItem?: (item: ContentItem) => React.ReactNode;
  className?: string;
  type?: 'comment' | 'review' | 'tip' | 'rule' | 'question';
  onLike?: (itemId: string) => void;
  onReply?: (itemId: string, content: string) => void;
  onDelete?: (itemId: string) => void;
  userRole?: 'admin' | 'moderator' | 'member';
}

const ContentList: React.FC<ContentListProps> = ({
  items,
  itemsPerPage = 5,
  filters,
  onFilterChange,
  renderItem,
  className = '',
  type = 'comment',
  onLike,
  onReply,
  onDelete,
  userRole
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState('recent');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [replyContent, setReplyContent] = useState<Record<string, string>>({});
  const [showReplyForm, setShowReplyForm] = useState<Record<string, boolean>>({});

  // Apply filters and sorting
  const filteredItems = [...items].sort((a, b) => {
    switch (activeFilter) {
      case 'likes':
        return sortOrder === 'desc' ? b.likes - a.likes : a.likes - b.likes;
      case 'rating':
        return sortOrder === 'desc' 
          ? (b.rating || 0) - (a.rating || 0) 
          : (a.rating || 0) - (b.rating || 0);
      case 'recent':
        return sortOrder === 'desc' 
          ? new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          : new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      default:
        return 0;
    }
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setCurrentPage(1);
    onFilterChange?.(filter);
  };

  const handleSortToggle = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleReplySubmit = (itemId: string) => {
    if (replyContent[itemId]?.trim()) {
      onReply?.(itemId, replyContent[itemId]);
      setReplyContent(prev => ({ ...prev, [itemId]: '' }));
      setShowReplyForm(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const defaultRenderItem = (item: ContentItem) => (
    <div key={item.id} className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <img 
            src={item.author.image} 
            alt={item.author.name}
            className="w-8 h-8 rounded-full mr-2"
          />
          <div>
            <div className="flex items-center">
              <span className="font-medium">{item.author.name}</span>
              {item.author.role && (
                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                  item.author.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                  item.author.role === 'moderator' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {item.author.role}
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500">{item.timestamp}</div>
          </div>
        </div>
        {(userRole === 'admin' || userRole === 'moderator') && (
          <button
            onClick={() => onDelete?.(item.id)}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Delete
          </button>
        )}
      </div>

      {type === 'review' && item.rating && (
        <div className="mb-2">
          <Rating value={item.rating} readonly size={16} />
        </div>
      )}

      <p className="text-gray-700 mb-3">{item.content}</p>

      <div className="flex items-center space-x-4 text-sm text-gray-500">
        <button 
          onClick={() => onLike?.(item.id)}
          className="flex items-center space-x-1 hover:text-blue-600"
        >
          <ThumbsUp className="h-4 w-4" />
          <span>{item.likes}</span>
        </button>
        {onReply && (
          <button
            onClick={() => setShowReplyForm(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
            className="flex items-center space-x-1 hover:text-blue-600"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Reply</span>
          </button>
        )}
      </div>

      {/* Replies */}
      {item.replies && item.replies.length > 0 && (
        <div className="mt-4 pl-4 border-l-2 border-gray-200 space-y-4">
          {item.replies.map(reply => defaultRenderItem(reply))}
        </div>
      )}

      {/* Reply Form */}
      {showReplyForm[item.id] && (
        <div className="mt-4">
          <textarea
            value={replyContent[item.id] || ''}
            onChange={(e) => setReplyContent(prev => ({ ...prev, [item.id]: e.target.value }))}
            placeholder="Write a reply..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          <div className="mt-2 flex justify-end space-x-2">
            <button
              onClick={() => setShowReplyForm(prev => ({ ...prev, [item.id]: false }))}
              className="px-3 py-1 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={() => handleReplySubmit(item.id)}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Reply
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={className}>
      {/* Filters */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleFilterChange('recent')}
            className={`px-3 py-1 rounded-md text-sm ${
              activeFilter === 'recent'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Most Recent
          </button>
          <button
            onClick={() => handleFilterChange('likes')}
            className={`px-3 py-1 rounded-md text-sm ${
              activeFilter === 'likes'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Most Liked
          </button>
          {type === 'review' && (
            <button
              onClick={() => handleFilterChange('rating')}
              className={`px-3 py-1 rounded-md text-sm ${
                activeFilter === 'rating'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Highest Rated
            </button>
          )}
          {filters?.map(filter => (
            <button
              key={filter.value}
              onClick={() => handleFilterChange(filter.value)}
              className={`px-3 py-1 rounded-md text-sm ${
                activeFilter === filter.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <button
          onClick={handleSortToggle}
          className="px-3 py-1 rounded-md text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          {sortOrder === 'desc' ? '↓ Descending' : '↑ Ascending'}
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {paginatedItems.map(item => (
          renderItem ? renderItem(item) : defaultRenderItem(item)
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center px-3 py-1 rounded-md text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="flex items-center px-3 py-1 rounded-md text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ContentList;