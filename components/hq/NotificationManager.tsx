
import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../../contexts/AppContext';
import { BackgroundTask } from '../../types';
import { CheckCircleIcon, XCircleIcon, XIcon } from '../icons';
import { useNavigate } from 'react-router-dom';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'completed' | 'error';
  resultId?: string;
}

const NotificationToast: React.FC<{ notification: Notification; onDismiss: (id: string) => void; }> = ({ notification, onDismiss }) => {
    // navigate is no longer used for aero redirect, but kept in case needed for other redirects later
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss(notification.id);
        }, 8000); // Auto-dismiss after 8 seconds
        return () => clearTimeout(timer);
    }, [notification.id, onDismiss]);

    const handleClick = () => {
        // Redirect logic removed as AeroPage is deprecated
        onDismiss(notification.id);
    };

    const isSuccess = notification.type === 'completed';

    return (
        <div onClick={handleClick} className={`w-80 rounded-lg shadow-2xl border cursor-pointer animate-slide-in-up ${isSuccess ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
            <div className="p-4 flex items-start gap-3">
                {isSuccess ? <CheckCircleIcon className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" /> : <XCircleIcon className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />}
                <div className="flex-grow">
                    <p className={`font-bold ${isSuccess ? 'text-green-300' : 'text-red-300'}`}>{notification.title}</p>
                    <p className="text-sm text-brand-text-secondary">{notification.message}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); onDismiss(notification.id); }} className="p-1 rounded-full hover:bg-white/10 text-brand-text-secondary flex-shrink-0">
                    <XIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

const NotificationManager: React.FC = () => {
    const { backgroundTasks } = useData();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const prevTasksRef = useRef<BackgroundTask[]>([]);

    useEffect(() => {
        // FIX: Explicitly type the Map to ensure correct type inference for `prevTask`.
        const prevTasksMap = new Map<string, BackgroundTask>(prevTasksRef.current.map(t => [t.id, t]));
        
        const newFinishedTasks = backgroundTasks.filter(task => {
            const prevTask = prevTasksMap.get(task.id);
            // Notify if task is newly finished (was running before, now it's not)
            return (task.status === 'completed' || task.status === 'error') && prevTask?.status === 'running';
        });

        if (newFinishedTasks.length > 0) {
            const newNotifications = newFinishedTasks.map(task => ({
                id: task.id,
                title: `Simulation ${task.status}`,
                message: `Your simulation for "${task.fileName}" has finished.`,
                type: task.status as 'completed' | 'error',
                resultId: task.resultId
            }));
            setNotifications(prev => [...prev, ...newNotifications]);
        }
        
        prevTasksRef.current = backgroundTasks;
    }, [backgroundTasks]);

    const dismissNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <div className="fixed bottom-6 right-6 space-y-3 z-[100]">
            {notifications.map(n => (
                <NotificationToast key={n.id} notification={n} onDismiss={dismissNotification} />
            ))}
        </div>
    );
};

export default NotificationManager;
