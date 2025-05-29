import React from 'react';
import ReactStars from 'react-rating-stars-component';

interface RatingProps {
  value: number;
  onChange?: (rating: number) => void;
  size?: number;
  readonly?: boolean;
  className?: string;
}

const Rating: React.FC<RatingProps> = ({
  value,
  onChange,
  size = 20,
  readonly = false,
  className = ''
}) => {
  return (
    <div className={className}>
      <ReactStars
        count={5}
        value={value}
        onChange={onChange}
        size={size}
        edit={!readonly && !!onChange}
        activeColor="#fbbf24"
        color="#d1d5db"
      />
    </div>
  );
};

export default Rating;