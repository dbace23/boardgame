import React from 'react';

interface BannerProps {
  title: string;
  subtitle?: string;
  image?: string;
  height?: 'small' | 'medium' | 'large';
}

const Banner: React.FC<BannerProps> = ({ 
  title, 
  subtitle, 
  image = 'https://images.pexels.com/photos/776654/pexels-photo-776654.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750', 
  height = 'medium'
}) => {
  const heightClass = {
    small: 'h-40 sm:h-48',
    medium: 'h-60 sm:h-72',
    large: 'h-80 sm:h-96'
  };
  
  return (
    <div className={`relative w-full ${heightClass[height]} overflow-hidden rounded-lg`}>
      <div className="absolute inset-0">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-900/40"></div>
      </div>
      
      <div className="relative flex flex-col justify-center h-full text-white px-4 sm:px-6 lg:px-8 z-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className="text-base sm:text-lg md:text-xl max-w-lg">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default Banner;