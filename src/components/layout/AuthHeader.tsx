import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';

interface AuthHeaderProps {
  className?: string;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ className = '' }) => {
  return (
    <div className={`bg-white shadow-sm ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center h-16">
          <Link to="/" className="flex items-center">
            <Menu className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-blue-600">BoardHaven</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthHeader;