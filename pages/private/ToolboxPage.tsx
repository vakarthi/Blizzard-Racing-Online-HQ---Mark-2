import React from 'react';
import ErrorBoundary from '../../components/ErrorBoundary';
import UnitConverter from '../../components/tools/UnitConverter';
import InteractiveChecklist from '../../components/tools/InteractiveChecklist';
import WeightBalanceCalculator from '../../components/tools/WeightBalanceCalculator';
import AiRenderTool from '../../components/tools/AiRenderTool';

const ToolboxPage: React.FC = () => {
  return (
    <div className="animate-fade-in space-y-8">
      <h1 className="text-3xl font-bold text-brand-text">Team Toolbox</h1>
      <p className="text-brand-text-secondary">A collection of smart utilities to streamline your workflow.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="lg:col-span-2">
            <ErrorBoundary>
                <AiRenderTool />
            </ErrorBoundary>
        </div>
        <ErrorBoundary>
            <UnitConverter />
        </ErrorBoundary>
        <ErrorBoundary>
            <WeightBalanceCalculator />
        </ErrorBoundary>
        <div className="lg:col-span-2">
            <ErrorBoundary>
                <InteractiveChecklist />
            </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default ToolboxPage;