
import React, { useState } from 'react';
import { useData } from '../../contexts/AppContext';
import { User } from '../../types';
import Modal from '../shared/Modal';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewTaskModal: React.FC<NewTaskModalProps> = ({ isOpen, onClose }) => {
  const { users, addTask } = useData();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) {
      alert('Please fill out the title and due date.');
      return;
    }

    addTask({
      title,
      description,
      assigneeId,
      dueDate,
    });

    // Reset form and close modal
    setTitle('');
    setDescription('');
    setAssigneeId(null);
    setDueDate('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-brand-text-secondary mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 bg-brand-dark border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-accent focus:outline-none"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-brand-text-secondary mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 bg-brand-dark border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-accent focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="assigneeId" className="block text-sm font-medium text-brand-text-secondary mb-1">
              Assignee
            </label>
            <select
              id="assigneeId"
              value={assigneeId ?? ''}
              onChange={(e) => setAssigneeId(e.target.value || null)}
              className="w-full px-3 py-2 bg-brand-dark border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-accent focus:outline-none"
            >
              <option value="">Unassigned</option>
              {users.map((user: User) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-brand-text-secondary mb-1">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 bg-brand-dark border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-accent focus:outline-none"
              required
            />
          </div>
        </div>
        <div className="pt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-brand-border text-brand-text font-semibold rounded-lg hover:bg-brand-text-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-brand-accent text-brand-dark font-bold rounded-lg hover:bg-brand-accent-hover transition-colors"
          >
            Save Task
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default NewTaskModal;
