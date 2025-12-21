
import React, { ReactNode } from 'react';
import ErrorBoundary from '../ErrorBoundary';

interface DashboardWidgetProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}

const DashboardWidget: React.FC<DashboardWidgetProps> = ({ title, icon, children, className = '' }) => {
  return (
    <div className={`glass-panel rounded-2xl flex flex-col transition-all hover:border-brand-border/80 ${className}`}>
        <div className="flex items-center px-6 py-4 border-b border-brand-border/50">
            <div className="p-2 bg-brand-surface rounded-lg mr-3 text-brand-accent border border-brand-border/50">
                {icon}
            </div>
            <h3 className="font-display font-bold text-lg text-brand-text tracking-tight">{title}</h3>
        </div>
        <div className="p-6 flex-grow overflow-y-auto">
            <ErrorBoundary>
                {children}
            </ErrorBoundary>
        </div>
    </div>
  );
};

export default DashboardWidget;
