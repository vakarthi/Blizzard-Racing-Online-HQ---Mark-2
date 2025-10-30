
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
    <div className={`bg-brand-dark-secondary rounded-xl shadow-md border border-brand-border flex flex-col ${className}`}>
        <div className="flex items-center p-4 border-b border-brand-border">
            <div className="text-brand-accent mr-3">{icon}</div>
            <h3 className="font-bold text-lg text-brand-text">{title}</h3>
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