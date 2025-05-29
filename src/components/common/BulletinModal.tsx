import React from 'react';
import { X, ThumbsUp, MessageSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Comment {
  id: string;
  author: {
    name: string;
    image: string;
    role: 'admin' | 'moderator' | 'member';
  };
  content: string;
  timestamp: string;
  likes: number;
}

interface BulletinModalProps {
  post: {
    id: string;
    author: {
      name: string;
      image: string;
      role: 'admin' | 'moderator' | 'member';
    };
    content: string;
    timestamp: string;
    likes: number;
    comments: Comment[];
  };
  onClose: () => void;
  userRole?: 'admin' | 'moderator' | 'member';
}

const BulletinModal: React.FC<BulletinModalProps> = ({ post, onClose, userRole }) => {
  const [newComment, setNewComment] = React.useState('');
  const [comments, setComments] = React.useState(post.comments);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now().toString(),
      author: {
        name: 'Current User',
        image: 'https://images.pexels.com/photos/1462630/pexels-photo-1462630.jpeg',
        role: userRole || 'member'
      },
      content: newComment,
      timestamp: 'Just now',
      likes: 0
    };

    setComments([...comments, comment]);
    setNewComment('');
    toast.success('Comment added successfully!');
  };

  const canModerate = userRole === 'admin' || userRole === 'moderator';

  const handleDelete = (commentId: string) => {
    setComments(comments.filter(comment => comment.id !== commentId));
    toast.success('Comment deleted successfully!');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <img
                  src={post.author.image}
                  alt={post.author.name}
                  className="h-10 w-10 rounded-full"
                />
                <div className="ml-3">
                  <div className="font-medium">{post.author.name}</div>
                  <div className="text-sm text-gray-500">{post.timestamp}</div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-2">
              <p className="text-gray-700">{post.content}</p>
            </div>

            <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
              <button className="flex items-center space-x-1">
                <ThumbsUp className="h-4 w-4" />
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center space-x-1">
                <MessageSquare className="h-4 w-4" />
                <span>{comments.length}</span>
              </button>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900">Comments</h3>
              <div className="mt-4 space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <img
                      src={comment.author.image}
                      alt={comment.author.name}
                      className="h-8 w-8 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">{comment.author.name}</span>
                          <span className="text-sm text-gray-500 ml-2">{comment.timestamp}</span>
                        </div>
                        {canModerate && (
                          <button
                            onClick={() => handleDelete(comment.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                      <p className="text-gray-700 mt-1">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmitComment} className="mt-6">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
                <div className="mt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Post Comment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulletinModal;