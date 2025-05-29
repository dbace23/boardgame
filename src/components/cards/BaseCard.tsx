import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

interface BaseCardProps {
  id: string;
  linkTo: string;
  children: React.ReactNode;
  className?: string;
}

const BaseCard: React.FC<BaseCardProps> = ({ 
  id, 
  linkTo, 
  children, 
  className = '' 
}) => {
  return (
    <Link to={linkTo} className="group">
      <div className={cn(
        "bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg",
        className
      )}>
        {children}
      </div>
    </Link>
  );
};

export default BaseCard;