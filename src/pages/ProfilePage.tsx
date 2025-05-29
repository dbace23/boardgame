import React, { useState } from 'react';
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
import { Star, ThumbsUp, Users, MessageSquare, Package, ChevronDown, ChevronUp, Store, Users2, Edit2, Send, Flag, Upload, Share2, X } from 'lucide-react';
import { User } from '../types';
import { toast } from 'react-hot-toast';
import Rating from '../components/common/Rating';
import ShareButtons from '../components/common/ShareButtons';
import ImageUpload from '../components/common/ImageUpload';
import { useAuth } from '../components/providers/AuthProvider';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

type Tab = 'info' | 'games' | 'list' | 'posts' | 'communities' | 'feedback';

interface FeedbackCategory {
  id: string;
  label: string;
}

const feedbackCategories: FeedbackCategory[] = [
  { id: 'ui', label: 'User Interface' },
  { id: 'features', label: 'Features' },
  { id: 'performance', label: 'Performance' },
  { id: 'bugs', label: 'Bug Reports' },
  { id: 'suggestions', label: 'Suggestions' },
  { id: 'other', label: 'Other' }
];

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('info');
  const [isEditing, setIsEditing] = useState(false);
  const [feedback, setFeedback] = useState({
    category: '',
    rating: {
      ui: 5,
      features: 5,
      performance: 5,
      support: 5
    },
    details: '',
    attachments: [] as File[]
  });

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedback.category) {
      toast.error('Please select a category');
      return;
    }

    if (!feedback.details.trim()) {
      toast.error('Please provide feedback details');
      return;
    }

    try {
      // Here you would normally send the feedback to your backend
      console.log('Submitting feedback:', feedback);
      
      toast.success('Thank you for your feedback!');
      setFeedback({
        category: '',
        rating: {
          ui: 5,
          features: 5,
          performance: 5,
          support: 5
        },
        details: '',
        attachments: []
      });
    } catch (error) {
      toast.error('Failed to submit feedback');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFeedback(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const removeAttachment = (index: number) => {
    setFeedback(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return (
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <Users className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Name</div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={user?.name}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="font-medium">{user?.name}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'games':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg shadow">
              <h3 className="font-semibold mb-2">Catan</h3>
              <p className="text-sm text-gray-600">Last played: 2 days ago</p>
            </div>
          </div>
        );
      case 'list':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-lg shadow">
              <h3 className="font-semibold mb-2">Wishlist</h3>
            </div>
          </div>
        );
      case 'posts':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-lg shadow">
              <h3 className="font-semibold mb-2">Recent Posts</h3>
            </div>
          </div>
        );
      case 'communities':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg shadow">
              <h3 className="font-semibold mb-2">Strategy Gamers United</h3>
              <p className="text-sm text-gray-600">Member since Jan 2024</p>
            </div>
          </div>
        );
      case 'feedback':
        return (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Platform Feedback</h2>
            <form onSubmit={handleFeedbackSubmit} className="space-y-6">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feedback Category
                </label>
                <select
                  value={feedback.category}
                  onChange={(e) => setFeedback(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a category</option>
                  {feedbackCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating Sliders */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">Rate Your Experience</h3>
                <div className="space-y-4">
                  {Object.entries(feedback.rating).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="capitalize w-32">{key}</span>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={value}
                        onChange={(e) => setFeedback(prev => ({
                          ...prev,
                          rating: {
                            ...prev.rating,
                            [key]: parseInt(e.target.value)
                          }
                        }))}
                        className="flex-1 mx-4"
                      />
                      <div className="flex items-center w-20">
                        <Rating value={value} readonly size={16} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feedback Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Feedback
                </label>
                <textarea
                  value={feedback.details}
                  onChange={(e) => setFeedback(prev => ({ ...prev, details: e.target.value }))}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Please share your thoughts, suggestions, or report any issues..."
                  required
                />
              </div>

              {/* File Attachments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attachments (Optional)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Upload files</span>
                        <input
                          id="file-upload"
                          type="file"
                          multiple
                          onChange={handleFileChange}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>

                {/* Attachment Preview */}
                {feedback.attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {feedback.attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                      >
                        <span className="text-sm text-gray-600">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="relative h-48 bg-blue-600">
            <div className="absolute -bottom-12 left-8 flex items-end">
              <div className="relative">
                <img 
                  src={user?.avatar_url}
                  alt={user?.name}
                  className="w-32 h-32 rounded-full border-4 border-white object-cover"
                />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg">
                    <Edit2 className="w-4 h-4 text-gray-600" />
                  </button>
                )}
              </div>
              <div className="ml-4 pb-4">
                <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
                <p className="text-blue-100">Member since January 2024</p>
              </div>
            </div>
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('Profile link copied to clipboard!');
                }}
                className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-50 flex items-center"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-50"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="pt-16 px-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'info'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Profile Info
                </button>
                <button
                  onClick={() => setActiveTab('games')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'games'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  My Board Games
                </button>
                <button
                  onClick={() => setActiveTab('list')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'list'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  My List
                </button>
                <button
                  onClick={() => setActiveTab('posts')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'posts'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Post History
                </button>
                <button
                  onClick={() => setActiveTab('communities')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'communities'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Communities
                </button>
                <button
                  onClick={() => setActiveTab('feedback')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'feedback'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Feedback
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="py-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;