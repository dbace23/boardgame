import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'wide';
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  aspectRatio = 'video'
}) => {
  const aspectRatioClass = {
    square: 'pb-[100%]',
    video: 'pb-[56.25%]', // 16:9
    wide: 'pb-[40%]'
  };

  return (
    <div className={`relative overflow-hidden ${aspectRatioClass[aspectRatio]} ${className}`}>
      <LazyLoadImage
        src={src}
        alt={alt}
        effect="blur"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        wrapperClassName="absolute inset-0"
      />
    </div>
  );
};

export default LazyImage;