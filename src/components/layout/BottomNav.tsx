import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Calendar, Store, ShoppingBag } from 'lucide-react';

const BottomNav: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden">
      <div className="flex justify-around items-center h-16">
        <Link
          to="/community"
          className={`flex flex-col items-center space-y-1 ${
            isActive('/community') ? 'text-blue-600' : 'text-gray-600'
          }`}
        >
          <Users className="w-6 h-6" />
          <span className="text-xs">Community</span>
        </Link>

        <Link
          to="/events"
          className={`flex flex-col items-center space-y-1 ${
            isActive('/events') ? 'text-blue-600' : 'text-gray-600'
          }`}
        >
          <Calendar className="w-6 h-6" />
          <span className="text-xs">Events</span>
        </Link>

        <Link
          to="/cafes"
          className={`flex flex-col items-center space-y-1 ${
            isActive('/cafes') ? 'text-blue-600' : 'text-gray-600'
          }`}
        >
          <Store className="w-6 h-6" />
          <span className="text-xs">Cafes</span>
        </Link>

        <Link
          to="/marketplace"
          className={`flex flex-col items-center space-y-1 ${
            isActive('/marketplace') ? 'text-blue-600' : 'text-gray-600'
          }`}
        >
          <ShoppingBag className="w-6 h-6" />
          <span className="text-xs">Market</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNav;