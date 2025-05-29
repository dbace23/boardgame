import { useState, useEffect } from 'react';
import { differenceInSeconds, formatDuration, intervalToDuration } from 'date-fns';

export function useCountdown(endTime: string) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const end = new Date(endTime);
      const now = new Date();
      const secondsLeft = differenceInSeconds(end, now);

      if (secondsLeft <= 0) {
        setIsExpired(true);
        setTimeLeft('Ended');
        return;
      }

      const duration = intervalToDuration({ start: now, end });
      const formatted = formatDuration(duration, {
        format: ['days', 'hours', 'minutes', 'seconds'],
        zero: true,
        delimiter: ' '
      });

      setTimeLeft(formatted);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return { timeLeft, isExpired };
}