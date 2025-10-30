
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center space-x-2">
        <div className="w-4 h-4 rounded-full bg-brand-accent animate-pulse-fast shadow-glow-accent"></div>
        <div className="w-4 h-4 rounded-full bg-brand-accent animate-pulse-fast [animation-delay:0.2s] shadow-glow-accent"></div>
        <div className="w-4 h-4 rounded-full bg-brand-accent animate-pulse-fast [animation-delay:0.4s] shadow-glow-accent"></div>
    </div>
  );
};

export default LoadingSpinner;