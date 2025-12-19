
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData, useAuth } from '../../contexts/AppContext';
import { HomeIcon, WindIcon, ClipboardListIcon, MessageSquareIcon, MessagesSquareIcon, WrenchIcon, SettingsIcon, UsersIcon, BotIcon, LogOutIcon, Settings2Icon } from '../icons';
import { UserRole } from '../../types';

interface Command {
  id: string;
  type: 'Navigation' | 'Action' | 'User' | 'Task';
  title: string;
  icon: React.ReactNode;
  action: () => void;
  keywords?: string;
}

const CommandPalette: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { users, tasks, discussionThreads } = useData();
    const { user, logout } = useAuth();

    useEffect(() => {
        inputRef.current?.focus();
        
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const commands: Command[] = useMemo(() => {
        const commandList: Command[] = [
        // Navigation
        { id: 'nav-dash', type: 'Navigation', title: 'Go to Dashboard', icon: <HomeIcon className="w-5 h-5"/>, action: () => navigate('/') },
        { id: 'nav-aero', type: 'Navigation', title: 'Go to Aero Testing', icon: <WindIcon className="w-5 h-5"/>, action: () => navigate('/aero') },
        { id: 'nav-projects', type: 'Navigation', title: 'Go to Projects', icon: <ClipboardListIcon className="w-5 h-5"/>, action: () => navigate('/projects') },
        { id: 'nav-comms', type: 'Navigation', title: 'Go to Comms Hub', icon: <MessagesSquareIcon className="w-5 h-5"/>, action: () => navigate('/comms') },
        { id: 'nav-socials', type: 'Navigation', title: 'Go to Socials', icon: <MessageSquareIcon className="w-5 h-5"/>, action: () => navigate('/socials') },
        { id: 'nav-toolbox', type: 'Navigation', title: 'Go to Toolbox', icon: <WrenchIcon className="w-5 h-5"/>, action: () => navigate('/toolbox') },
        { id: 'nav-settings', type: 'Navigation', title: 'Go to Settings', icon: <SettingsIcon className="w-5 h-5"/>, action: () => navigate('/settings') },
        // Actions
        { id: 'act-logout', type: 'Action', title: 'Logout', icon: <LogOutIcon className="w-5 h-5"/>, action: logout, keywords: 'sign out exit' },
        // Dynamic Content
        ...users.map(user => ({
            id: `user-${user.id}`,
            type: 'User' as 'User',
            title: user.name,
            icon: <img src={user.avatarUrl} className="w-5 h-5 rounded-full object-cover" alt={user.name}/>,
            action: () => alert(`User: ${user.name}\nRole: ${user.role}\nEmail: ${user.email}`),
            keywords: user.role,
        })),
        ...tasks.map(task => ({
            id: `task-${task.id}`,
            type: 'Task' as 'Task',
            title: task.title,
            icon: <ClipboardListIcon className="w-5 h-5"/>,
            action: () => navigate('/projects'),
            keywords: `task project ${task.status}`
        })),
        ];

        if (user?.role === UserRole.Manager) {
            commandList.push({ id: 'nav-manager', type: 'Navigation', title: 'Go to Manager Panel', icon: <Settings2Icon className="w-5 h-5"/>, action: () => navigate('/manager'), keywords: 'admin command center' });
        }
        
        return commandList;

    }, [navigate, users, tasks, logout, user]);
    
    const filteredCommands = useMemo(() => {
        if (!query.trim()) return commands.slice(0, 10); // Show some default commands
        const lowerQuery = query.toLowerCase();
        return commands.filter(cmd => 
            cmd.title.toLowerCase().includes(lowerQuery) ||
            cmd.type.toLowerCase().includes(lowerQuery) ||
            (cmd.keywords && cmd.keywords.toLowerCase().includes(lowerQuery))
        ).slice(0, 10);
    }, [query, commands]);

    useEffect(() => {
        setActiveIndex(0);
    }, [query]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveIndex(prev => (prev + 1) % filteredCommands.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (filteredCommands[activeIndex]) {
                    filteredCommands[activeIndex].action();
                    onClose();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeIndex, filteredCommands, onClose]);

     useEffect(() => {
        resultsRef.current?.children[activeIndex]?.scrollIntoView({
            block: 'nearest',
        });
    }, [activeIndex]);

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-start pt-24 animate-fade-in" onClick={onClose}>
            <div className="w-full max-w-2xl bg-brand-dark-secondary rounded-xl shadow-2xl border border-brand-border" onClick={e => e.stopPropagation()}>
                <div className="p-2 border-b border-brand-border">
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Type a command or search..."
                        className="w-full bg-transparent p-3 text-lg focus:outline-none"
                    />
                </div>
                <div ref={resultsRef} className="max-h-[400px] overflow-y-auto p-2">
                    {filteredCommands.length > 0 ? (
                        filteredCommands.map((cmd, index) => (
                            <button
                                key={cmd.id}
                                onClick={() => { cmd.action(); onClose(); }}
                                className={`w-full text-left flex items-center gap-4 p-3 rounded-md transition-colors ${activeIndex === index ? 'bg-brand-accent text-brand-dark' : 'hover:bg-brand-surface'}`}
                            >
                                <span className={activeIndex === index ? 'text-brand-dark' : 'text-brand-text-secondary'}>{cmd.icon}</span>
                                <div className="flex-grow">
                                    <p className="font-semibold">{cmd.title}</p>
                                </div>
                                <span className={`text-xs font-mono px-2 py-1 rounded ${activeIndex === index ? 'bg-black/20' : 'bg-brand-dark text-brand-text-secondary'}`}>{cmd.type}</span>
                            </button>
                        ))
                    ) : (
                        <div className="text-center p-8 text-brand-text-secondary">
                            <p>No results found for "{query}"</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommandPalette;
