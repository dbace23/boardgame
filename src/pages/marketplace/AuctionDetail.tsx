import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import Navbar from '../../components/layout/Navbar';
import { Clock, DollarSign, Package, MessageSquare, Share2, Flag, Trophy } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../components/providers/AuthProvider';
import ContentList from '../../components/common/ContentList';
import ShareButtons from '../../components/common/ShareButtons';
import { formatCurrency } from '../../utils/format';
import { useCountdown } from '../../hooks/useCountdown';

interface Bid {
  id: string;
  bidder: {
    id: string;
    name: string;
    rating: number;
  };
  amount: number;
  time: string;
}

const AuctionDetailPage: React.FC = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [bidAmount, setBidAmount] = useState('');
  const [newComment, setNewComment] = useState('');

  // Mock auction data
  const auction = {
    id: '1',
    title: 'Catan Board Game - Like New Condition',
    description: 'Complete set of Catan in excellent condition. Only played a few times.',
    currentPrice: 25.00,
    buyNowPrice: 45.00,
    startTime: new Date('2024-05-15T10:00:00Z'),
    endTime: new Date('2024-05-20T15:00:00Z'),
    condition: 'like_new',
    bids: 5,
    watchers: 12,
    bidIncrement: 1.00,
    image: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
    seller: {
      id: '1',
      name: 'John Doe',
      rating: 4.8,
      totalSales: 45,
      successfulSales: 43
    },
    shippingInfo: 'Free shipping within US. International shipping available.',
    bidHistory: [
      {
        id: '1',
        bidder: {
          id: 'user1',
          name: 'Alice',
          rating: 4.9
        },
        amount: 25.00,
        time: '2024-05-15T12:00:00Z'
      },
      {
        id: '2',
        bidder: {
          id: 'user2',
          name: 'Bob',
          rating: 4.7
        },
        amount: 24.00,
        time: '2024-05-15T11:30:00Z'
      },
      {
        id: '3',
        bidder: {
          id: 'user3',
          name: 'Charlie',
          rating: 4.8
        },
        amount: 23.00,
        time: '2024-05-15T11:00:00Z'
      }
    ] as Bid[]
  };

  const { timeLeft, isExpired } = useCountdown(auction.endTime.toISOString());

  const handleBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in to place a bid');
      return;
    }

    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= auction.currentPrice) {
      toast.error(`Bid must be at least ${formatCurrency(auction.currentPrice + auction.bidIncrement)}`);
      return;
    }

    toast.success('Bid placed successfully!');
    setBidAmount('');
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to buy');
      return;
    }
    toast.success('Purchase successful!');
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

  const renderWinnerBadge = (position: number) => {
    const colors = {
      1: 'bg-yellow-100 text-yellow-800',
      2: 'bg-gray-100 text-gray-800',
      3: 'bg-orange-100 text-orange-800'
    };

    return (
      <div className={`flex items-center px-2 py-1 rounded-full ${colors[position as keyof typeof colors]}`}>
        <Trophy className="w-4 h-4 mr-1" />
        <span>{position === 1 ? 'Winner' : `${position}nd Place`}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Image Section */}
            <div>
              <div className="relative pb-[100%] overflow-hidden rounded-lg">
                <img 
                  src={auction.image}
                  alt={auction.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {isExpired && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-bold text-3xl">AUCTION ENDED</span>
                  </div>
                )}
              </div>
            </div>

            {/* Auction Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold mb-2">{auction.title}</h1>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">
                      Seller: {auction.seller.name} ({auction.seller.rating}★)
                    </span>
                    <span className="text-gray-600">
                      ({auction.seller.successfulSales}/{auction.seller.totalSales} successful sales)
                    </span>
                  </div>
                  <ShareButtons
                    url={window.location.href}
                    title={`Check out this auction: ${auction.title}`}
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm text-gray-500">Current Bid</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(auction.currentPrice)}
                      {auction.bidIncrement && (
                        <span className="text-sm text-gray-500 ml-2">
                          (Min. increment: {formatCurrency(auction.bidIncrement)})
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Time Left</div>
                    <div className="text-lg font-semibold text-gray-800">
                      {timeLeft}
                    </div>
                  </div>
                </div>

                {!isExpired ? (
                  <>
                    <form onSubmit={handleBid} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Your Bid
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="number"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            min={auction.currentPrice + auction.bidIncrement}
                            step={auction.bidIncrement}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                            placeholder={`Min bid: ${formatCurrency(auction.currentPrice + auction.bidIncrement)}`}
                          />
                          <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            Place Bid
                          </button>
                        </div>
                      </div>
                    </form>

                    {auction.buyNowPrice && (
                      <button
                        onClick={handleBuyNow}
                        className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        Buy Now for {formatCurrency(auction.buyNowPrice)}
                      </button>
                    )}
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-lg font-semibold text-gray-800">
                      This auction has ended
                    </p>
                    {auction.bidHistory.length > 0 && (
                      <p className="text-green-600 font-medium mt-2">
                        Won by {auction.bidHistory[0].bidder.name} for {formatCurrency(auction.bidHistory[0].amount)}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Item Details</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Condition</div>
                      <div className="font-medium">{auction.condition.replace('_', ' ')}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Bids</div>
                      <div className="font-medium">{auction.bids}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Watchers</div>
                      <div className="font-medium">{auction.watchers}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-2">Description</h2>
                  <p className="text-gray-600">{auction.description}</p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-2">Shipping</h2>
                  <p className="text-gray-600">{auction.shippingInfo}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bid History and Comments */}
          <div className="border-t border-gray-200 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Bid History */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Bid History</h2>
                <div className="space-y-4">
                  {auction.bidHistory.map((bid, index) => (
                    <div key={bid.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="flex items-center">
                          <div className="font-medium">{bid.bidder.name}</div>
                          {index < 3 && isExpired && renderWinnerBadge(index + 1)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(bid.time), { addSuffix: true })}
                        </div>
                      </div>
                      <div className="font-semibold text-blue-600">
                        {formatCurrency(bid.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comments */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Questions & Comments</h2>
                <form onSubmit={handleCommentSubmit} className="mb-6">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Ask a question about this item..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={4}
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

                <ContentList
                  items={[
                    {
                      id: '1',
                      author: {
                        name: 'Alice Johnson',
                        image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg'
                      },
                      content: 'Is shipping available internationally?',
                      timestamp: '2 hours ago',
                      likes: 1,
                      replies: []
                    }
                  ]}
                  type="comment"
                  onLike={(id) => console.log('Like comment:', id)}
                  onReply={(id, content) => console.log('Reply to comment:', id, content)}
                  onDelete={(id) => console.log('Delete comment:', id)}
                  userRole="member"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuctionDetailPage;