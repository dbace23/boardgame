import React from 'react';
import { cn } from '../../utils/cn';
import LazyImage from '../common/LazyImage';

interface ImageHeaderProps {
  image: string;
  alt: string;
  aspectRatio?: 'square' | 'video' | 'wide';
  className?: string;
}

const ImageHeader: React.FC<ImageHeaderProps> = ({ 
  image, 
  alt, 
  aspectRatio = 'video',
  className = ''
}) => {
  return (
    <LazyImage
      src={image}
      alt={alt}
      aspectRatio={aspectRatio}
      className={className}
    />
  );
};

export default ImageHeader;