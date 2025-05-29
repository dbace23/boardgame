import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../components/providers/AuthProvider';
import { toast } from 'react-hot-toast';
import { Upload, Save, X, Flag, Check, AlertTriangle, MessageSquare, Filter } from 'lucide-react';
import ImageUpload from '../components/common/ImageUpload';

interface BannerSettings {
  title: string;
  subtitle: string;
  image: string;
}

interface NewsItem {
  title: string;
  content: string;
  image: string;
  category: string;
}

interface CrowdfundingProject {
  title: string;
  description: string;
  goalAmount: number;
  endDate: string;
  image: string;
}

interface Report {
  id: string;
  type: 'comment' | 'user' | 'content';
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
  reporter: {
    name: string;
    id: string;
  };
  reportedItem: {
    id: string;
    content: string;
    author: string;
  };
}

const DeveloperPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'banner' | 'news' | 'projects' | 'reports'>('banner');
  const [reportFilter, setReportFilter] = useState<'all' | 'pending' | 'resolved'>('all');
  const [reportType, setReportType] = useState<'all' | 'comment' | 'user' | 'content'>('all');
  
  const [bannerSettings, setBannerSettings] = useState<BannerSettings>({
    title: 'Welcome to BoardHaven',
    subtitle: 'Your Ultimate Board Gaming Community',
    image: 'https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg'
  });

  const [newsItem, setNewsItem] = useState<NewsItem>({
    title: '',
    content: '',
    image: '',
    category: 'news'
  });

  const [project, setProject] = useState<CrowdfundingProject>({
    title: '',
    description: '',
    goalAmount: 0,
    endDate: '',
    image: ''
  });

  // Mock reports data
  const [reports] = useState<Report[]>([
    {
      id: '1',
      type: 'comment',
      reason: 'Inappropriate content',
      status: 'pending',
      createdAt: '2024-03-15T10:30:00Z',
      reporter: {
        name: 'John Doe',
        id: 'user1'
      },
      reportedItem: {
        id: 'comment1',
        content: 'This is the reported comment content...',
        author: 'Jane Smith'
      }
    },
    {
      id: '2',
      type: 'user',
      reason: 'Spam',
      status: 'resolved',
      createdAt: '2024-03-14T15:45:00Z',
      reporter: {
        name: 'Alice Johnson',
        id: 'user2'
      },
      reportedItem: {
        id: 'user3',
        content: 'User profile reported for spam',
        author: 'SpamUser123'
      }
    }
  ]);

  const handleBannerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Banner settings updated successfully!');
  };

  const handleNewsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('News item created successfully!');
    setNewsItem({
      title: '',
      content: '',
      image: '',
      category: 'news'
    });
  };

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Project created successfully!');
    setProject({
      title: '',
      description: '',
      goalAmount: 0,
      endDate: '',
      image: ''
    });
  };

  const handleReportAction = (reportId: string, action: 'resolve' | 'dismiss') => {
    toast.success(`Report ${action === 'resolve' ? 'resolved' : 'dismissed'} successfully!`);
  };

  const filteredReports = reports.filter(report => {
    if (reportFilter !== 'all' && report.status !== reportFilter) return false;
    if (reportType !== 'all' && report.type !== reportType) return false;
    return true;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">Please log in to access the developer settings.</p>
        </div>
      </div>
    );
  }

  const renderReportsSection = () => (
    <section className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Reports & Moderation</h2>
        <div className="flex space-x-4">
          <select
            value={reportFilter}
            onChange={(e) => setReportFilter(e.target.value as any)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
          </select>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value as any)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Types</option>
            <option value="comment">Comments</option>
            <option value="user">Users</option>
            <option value="content">Content</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredReports.map(report => (
          <div key={report.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  Reported {new Date(report.createdAt).toLocaleDateString()}
                </span>
              </div>
              {report.status === 'pending' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleReportAction(report.id, 'resolve')}
                    className="p-1 text-green-600 hover:text-green-800"
                    title="Resolve"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleReportAction(report.id, 'dismiss')}
                    className="p-1 text-red-600 hover:text-red-800"
                    title="Dismiss"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded p-3 mb-3">
              <div className="flex items-start space-x-2">
                <MessageSquare className="w-4 h-4 text-gray-400 mt-1" />
                <div>
                  <p className="text-gray-700">{report.reportedItem.content}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    By: {report.reportedItem.author}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div>
                <span className="text-gray-500">Reported by:</span>
                <span className="ml-1 font-medium">{report.reporter.name}</span>
              </div>
              <div>
                <span className="text-gray-500">Reason:</span>
                <span className="ml-1 text-red-600">{report.reason}</span>
              </div>
            </div>
          </div>
        ))}

        {filteredReports.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No reports found matching the current filters.
          </div>
        )}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Developer Settings</h1>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('banner')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'banner'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Banner Settings
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'news'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            News Management
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'projects'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'reports'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Reports
          </button>
        </div>

        {/* Active Section */}
        {activeTab === 'banner' && (
          <section className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Home Banner Settings</h2>
            <form onSubmit={handleBannerSubmit} className="space-y-4">
              {/* Banner settings form fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Title
                </label>
                <input
                  type="text"
                  value={bannerSettings.title}
                  onChange={(e) => setBannerSettings({ ...bannerSettings, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Subtitle
                </label>
                <input
                  type="text"
                  value={bannerSettings.subtitle}
                  onChange={(e) => setBannerSettings({ ...bannerSettings, subtitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Image
                </label>
                <ImageUpload
                  onUploadComplete={(url) => setBannerSettings({ ...bannerSettings, image: url })}
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Save className="w-4 h-4 inline-block mr-2" />
                Save Banner Settings
              </button>
            </form>
          </section>
        )}

        {activeTab === 'news' && (
          <section className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create News Item</h2>
            <form onSubmit={handleNewsSubmit} className="space-y-4">
              {/* News creation form fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  News Title
                </label>
                <input
                  type="text"
                  value={newsItem.title}
                  onChange={(e) => setNewsItem({ ...newsItem, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={newsItem.content}
                  onChange={(e) => setNewsItem({ ...newsItem, content: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={newsItem.category}
                  onChange={(e) => setNewsItem({ ...newsItem, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="news">News</option>
                  <option value="events">Events</option>
                  <option value="releases">New Releases</option>
                  <option value="community">Community</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  News Image
                </label>
                <ImageUpload
                  onUploadComplete={(url) => setNewsItem({ ...newsItem, image: url })}
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create News Item
              </button>
            </form>
          </section>
        )}

        {activeTab === 'projects' && (
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create Crowdfunding Project</h2>
            <form onSubmit={handleProjectSubmit} className="space-y-4">
              {/* Project creation form fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Title
                </label>
                <input
                  type="text"
                  value={project.title}
                  onChange={(e) => setProject({ ...project, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={project.description}
                  onChange={(e) => setProject({ ...project, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Goal Amount ($)
                </label>
                <input
                  type="number"
                  value={project.goalAmount}
                  onChange={(e) => setProject({ ...project, goalAmount: parseFloat(e.target.value) })}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={project.endDate}
                  onChange={(e) => setProject({ ...project, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Image
                </label>
                <ImageUpload
                  onUploadComplete={(url) => setProject({ ...project, image: url })}
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Project
              </button>
            </form>
          </section>
        )}

        {activeTab === 'reports' && renderReportsSection()}
      </main>
    </div>
  );
};

export default DeveloperPage;