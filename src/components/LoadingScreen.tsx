
import React from 'react';
import { useMood } from '@/context/MoodContext';

const LoadingScreen: React.FC = () => {
  const { mood } = useMood() || { mood: 'neutral' };
  
  // Determine color based on mood
  const getColor = () => {
    switch (mood) {
      case 'happy':
        return 'stroke-green-500';
      case 'sad':
        return 'stroke-blue-500';
      case 'angry':
        return 'stroke-orange-500';
      default:
        return 'stroke-primary';
    }
  };
  
  return (
    <div className="flex items-center justify-center h-screen w-full bg-background">
      <div className="text-center">
        <svg
          className={`w-16 h-16 mx-auto mood-spinner ${getColor()}`}
          viewBox="0 0 50 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="25"
            cy="25"
            r="20"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
        <p className="mt-4 text-xl font-medium text-foreground">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
