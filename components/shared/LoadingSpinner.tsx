
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center">
        <div className="relative w-12 h-12">
            {/* Devil Fruit Spiral Effect */}
            <div className="absolute inset-0 border-4 border-brand-accent/30 rounded-full animate-swirl" style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }}></div>
            <div className="absolute inset-2 border-4 border-brand-accent rounded-full animate-swirl [animation-direction:reverse]" style={{ borderRadius: '60% 40% 30% 70% / 50% 40% 60% 50%' }}></div>
            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        </div>
        <p className="mt-2 text-[10px] font-mono text-brand-text-secondary uppercase tracking-widest animate-pulse">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;
