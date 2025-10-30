
import React, { useState, DragEvent } from 'react';
import { Task, TaskStatus, User } from '../../types';
import { useData } from '../../contexts/AppContext';

const statusOrder = [TaskStatus.ToDo, TaskStatus.InProgress, TaskStatus.InReview, TaskStatus.Done];

const TaskCard: React.FC<{ task: Task; onDragStart: (e: DragEvent, taskId: string) => void }> = ({ task, onDragStart }) => {
  const { getTeamMember } = useData();
  const assignee = task.assigneeId ? getTeamMember(task.assigneeId) : null;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      className="bg-brand-dark p-3 mb-3 rounded-lg border border-brand-border shadow-md cursor-grab active:cursor-grabbing hover:border-brand-accent transition-colors"
    >
      <p className="font-semibold text-brand-text mb-2">{task.title}</p>
      {assignee && (
        <div className="flex items-center mt-3 pt-3 border-t border-brand-border">
          <img src={assignee.avatarUrl} alt={assignee.name} className="w-6 h-6 rounded-full mr-2" />
          <span className="text-sm text-brand-text-secondary">{assignee.name}</span>
        </div>
      )}
    </div>
  );
};

const KanbanColumn: React.FC<{
  status: TaskStatus;
  tasks: Task[];
  onDragStart: (e: DragEvent, taskId: string) => void;
  onDrop: (e: DragEvent, status: TaskStatus) => void;
}> = ({ status, tasks, onDragStart, onDrop }) => {
  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const statusColors: { [key in TaskStatus]: string } = {
    [TaskStatus.ToDo]: 'bg-yellow-400',
    [TaskStatus.InProgress]: 'bg-blue-400',
    [TaskStatus.InReview]: 'bg-purple-400',
    [TaskStatus.Done]: 'bg-green-400',
  };

  return (
    <div
      onDrop={(e) => onDrop(e, status)}
      onDragOver={onDragOver}
      className="bg-brand-dark-secondary rounded-lg p-3 w-full md:w-1/4 flex-shrink-0"
    >
      <div className="flex items-center mb-4">
        <span className={`w-3 h-3 rounded-full mr-2 ${statusColors[status]}`}></span>
        <h4 className="font-bold text-brand-text">{status}</h4>
        <span className="ml-auto text-sm font-semibold bg-brand-dark text-brand-text-secondary rounded-full px-2 py-0.5">
          {tasks.length}
        </span>
      </div>
      <div className="min-h-[200px]">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} onDragStart={onDragStart} />
        ))}
      </div>
    </div>
  );
};

const KanbanBoard: React.FC = () => {
  const { tasks, updateTask } = useData();

  const handleDragStart = (e: DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDrop = (e: DragEvent, newStatus: TaskStatus) => {
    const taskId = e.dataTransfer.getData("taskId");
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      updateTask({ ...task, status: newStatus });
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full overflow-x-auto pb-4">
      {statusOrder.map(status => (
        <KanbanColumn
          key={status}
          status={status}
          tasks={tasks.filter(t => t.status === status)}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
        />
      ))}
    </div>
  );
};

export default KanbanBoard;