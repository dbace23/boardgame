import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { Clock, DollarSign, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  image: string;
  date: string;
  category: string;
}

interface CrowdfundingProject {
  id: string;
  title: string;
  description: string;
  image: string;
  goalAmount: number;
  currentAmount: number;
  endDate: string;
  backers: number;
}

const HomePage: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const newsScrollRef = useRef<HTMLDivElement>(null);
  const projectsScrollRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);

  // Fetch banner settings from backend
  const bannerSettings = {
    title: 'Welcome to BoardHaven',
    subtitle: 'Your Ultimate Board Gaming Community',
    image: 'https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg'
  };

  // Fetch news items from backend
  const [newsItems] = useState<NewsItem[]>([
    {
      id: '1',
      title: 'New Catan Championship Series Announced',
      content: 'Global tournament series with $100,000 prize pool',
      image: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
      date: '2024-05-15',
      category: 'Tournaments'
    },
    // ... other news items
  ]);

  // Fetch crowdfunding projects from backend
  const [projects] = useState<CrowdfundingProject[]>([
    {
      id: '1',
      title: 'Epic Quest: The Board Game',
      description: 'A revolutionary cooperative adventure game',
      image: 'https://images.pexels.com/photos/1329545/pexels-photo-1329545.jpeg',
      goalAmount: 50000,
      currentAmount: 35000,
      endDate: '2024-06-15T00:00:00Z',
      backers: 750
    },
    // ... other projects
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % newsItems.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [newsItems.length]);

  const calculateProgress = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const scrollNews = (direction: 'left' | 'right') => {
    if (!newsScrollRef.current) return;

    const scrollAmount = direction === 'left' ? -280 : 280;
    newsScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleNewsScroll = () => {
    if (!newsScrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = newsScrollRef.current;
    setShowLeftScroll(scrollLeft > 0);
    setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const newsContainer = newsScrollRef.current;
    if (newsContainer) {
      newsContainer.addEventListener('scroll', handleNewsScroll);
      handleNewsScroll();
    }

    return () => {
      if (newsContainer) {
        newsContainer.removeEventListener('scroll', handleNewsScroll);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main>
        {/* Hero Banner */}
        <div className="relative h-[500px] overflow-hidden">
          <img
            src={bannerSettings.image}
            alt="Welcome to BoardHaven"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-4xl font-bold mb-2">{bannerSettings.title}</h1>
              <p className="text-lg mb-4">{bannerSettings.subtitle}</p>
              <Link
                to="/games"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Explore Games
              </Link>
            </div>
          </div>
        </div>

        {/* Latest News */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Latest News</h2>
              <Link
                to="/news"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                View All
              </Link>
            </div>
            <div className="relative">
              {showLeftScroll && (
                <button
                  onClick={() => scrollNews('left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center z-10 hover:bg-gray-50"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}
              {showRightScroll && (
                <button
                  onClick={() => scrollNews('right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center z-10 hover:bg-gray-50"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              )}
              <div
                ref={newsScrollRef}
                className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide scroll-smooth"
                onScroll={handleNewsScroll}
              >
                {newsItems.map(item => (
                  <Link
                    key={item.id}
                    to={`/news/${item.id}`}
                    className="flex-none w-72"
                  >
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="relative pb-[56.25%]">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-md mb-2">
                          {item.category}
                        </span>
                        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{item.title}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.content}</p>
                        <span className="text-sm text-gray-500">{item.date}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Crowdfunding Projects */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8">Live Crowdfunding Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <Link
                  key={project.id}
                  to={`/crowdfunding/${project.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative pb-[56.25%]">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    
                    <div className="space-y-4">
                      {/* Progress Bar */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>${project.currentAmount.toLocaleString()}</span>
                          <span>${project.goalAmount.toLocaleString()}</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{
                              width: `${calculateProgress(
                                project.currentAmount,
                                project.goalAmount
                              )}%`
                            }}
                          />
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex justify-between text-sm text-gray-600">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {project.backers}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {Math.round(
                            (project.currentAmount / project.goalAmount) * 100
                          )}%
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatDistanceToNow(new Date(project.endDate), {
                            addSuffix: true
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;