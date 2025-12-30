import React, { ReactNode } from 'react';
import ErrorBoundary from '../ErrorBoundary';

interface DashboardWidgetProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
  accentColor?: string; // Optional custom accent color class
}

const DashboardWidget: React.FC<DashboardWidgetProps> = ({ title, icon, children, className = '', accentColor = 'text-brand-accent' }) => {
  return (
    <div className={`holo-card rounded-xl flex flex-col transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] group ${className}`}>
        {/* Tech Corner Markers */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-brand-accent opacity-50 group-hover:opacity-100 transition-opacity"></div>
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-brand-accent opacity-50 group-hover:opacity-100 transition-opacity"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-brand-accent opacity-50 group-hover:opacity-100 transition-opacity"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-brand-accent opacity-50 group-hover:opacity-100 transition-opacity"></div>

        <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/5">
            <div className="flex items-center gap-3">
                <div className={`p-1.5 bg-black rounded border border-white/10 ${accentColor}`}>
                    {icon}
                </div>
                <h3 className="font-display font-bold text-sm text-brand-text tracking-wide uppercase">{title}</h3>
            </div>
            {/* Blinking Status LED */}
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-[pulse_2s_infinite]"></div>
        </div>
        <div className="p-5 flex-grow overflow-y-auto relative">
            <ErrorBoundary>
                {children}
            </ErrorBoundary>
        </div>
    </div>
  );
};

export default DashboardWidget;