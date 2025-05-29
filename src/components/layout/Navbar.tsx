import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ChevronDown, LogOut, User, Search } from 'lucide-react';
import { useAuth } from '../providers/AuthProvider';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, signOut } = useAuth();
  const [showBrowseMenu, setShowBrowseMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left section */}
          <div className="flex items-center">
            <Link to="/" className="text-blue-600 hover:text-blue-700">
              <Home className="h-6 w-6" />
            </Link>

            {/* Browse Menu - Hidden on mobile */}
            <div className="hidden md:flex md:items-center md:ml-8">
              <div className="relative">
                <button
                  onClick={() => setShowBrowseMenu(!showBrowseMenu)}
                  className="flex items-center text-gray-700 hover:text-blue-600"
                >
                  Browse
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                
                {showBrowseMenu && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/games"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowBrowseMenu(false)}
                    >
                      Board Games
                    </Link>
                    <Link
                      to="/ranking"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowBrowseMenu(false)}
                    >
                      Rankings
                    </Link>
                  </div>
                )}
              </div>

              {/* Desktop Navigation Links */}
              <Link
                to="/community"
                className="ml-8 text-gray-700 hover:text-blue-600"
              >
                Community
              </Link>

              <Link
                to="/events"
                className="ml-8 text-gray-700 hover:text-blue-600"
              >
                Events
              </Link>

              <Link
                to="/cafes"
                className="ml-8 text-gray-700 hover:text-blue-600"
              >
                Cafes
              </Link>

              <Link
                to="/marketplace"
                className="ml-8 text-gray-700 hover:text-blue-600"
              >
                Marketplace
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 flex items-center justify-center px-2 lg:px-6 max-w-lg">
            <div className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Right section - Auth */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
                >
                  {user?.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6" />
                  )}
                  <span className="hidden md:inline">{user?.name}</span>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setShowProfileMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="inline-block w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;