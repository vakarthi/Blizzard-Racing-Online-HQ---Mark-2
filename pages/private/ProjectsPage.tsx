

import React, { useState } from 'react';
import KanbanBoard from '../../components/hq/Kanban';
import ErrorBoundary from '../../components/ErrorBoundary';
import NewTaskModal from '../../components/hq/NewTaskModal';

const ProjectsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-brand-text">Project Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-accent text-brand-dark font-bold py-2 px-4 rounded-lg hover:bg-brand-accent-hover transition-colors"
        >
          + New Task
        </button>
      </div>
      <ErrorBoundary>
        <KanbanBoard />
      </ErrorBoundary>
      <NewTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default ProjectsPage;