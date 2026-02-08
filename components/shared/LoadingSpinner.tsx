
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center relative p-16">
        {/* Background Pulse */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="w-32 h-32 bg-brand-accent/10 rounded-full blur-xl animate-pulse"></div>
        </div>

        {/* Tech Spinner */}
        <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-brand-border rounded-full"></div>
            <div className="absolute inset-0 border-4 border-brand-accent rounded-full border-t-transparent animate-spin"></div>
        </div>
        
        <div className="mt-8 text-center relative z-10">
            <h2 className="text-lg font-bold text-brand-text tracking-widest uppercase animate-pulse">
                Loading System
            </h2>
            <div className="flex items-center justify-center gap-2 mt-2">
                <div className="h-[1px] w-4 bg-brand-border"></div>
                <p className="text-[10px] font-mono text-brand-text-secondary uppercase">
                    Blizzard HQ
                </p>
                <div className="h-[1px] w-4 bg-brand-border"></div>
            </div>
        </div>
    </div>
  );
};

export default LoadingSpinner;
