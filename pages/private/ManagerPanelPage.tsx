import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useData, useAppState } from '../../contexts/AppContext';
import { UserRole, TaskStatus, SponsorTier, User, NewsPost, CarHighlight, CompetitionProgressItem, Protocol, Task } from '../../types';
import { UsersIcon, DollarSignIcon, ClipboardListIcon, TrophyIcon, Settings2Icon, PieChartIcon, PlusCircleIcon, DownloadIcon, UploadIcon, NewspaperIcon, FlagIcon, FileCheckIcon, TrashIcon } from '../../components/icons';
import Modal from '../../components/shared/Modal';

// --- EDIT TASK MODAL ---
const EditTaskModal: React.FC<{ isOpen: boolean; onClose: () => void; task: Task; }> = ({ isOpen, onClose, task }) => {
    const { users, updateTask } = useData();
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [assigneeId, setAssigneeId] = useState(task.assigneeId);
    const [dueDate, setDueDate] = useState(task.dueDate);
    const [status, setStatus] = useState(task.status);

    useEffect(() => {
        setTitle(task.title);
        setDescription(task.description);
        setAssigneeId(task.assigneeId);
        setDueDate(task.dueDate);
        setStatus(task.status);
    }, [task]);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateTask({ ...task, title, description, assigneeId, dueDate, status });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Task">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-brand-text-secondary mb-1">Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 bg-brand-dark border border-brand-border rounded-lg" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-brand-text-secondary mb-1">Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full p-2 bg-brand-dark border border-brand-border rounded-lg" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-brand-text-secondary mb-1">Assignee</label>
                        <select value={assigneeId ?? ''} onChange={(e) => setAssigneeId(e.target.value || null)} className="w-full p-2 bg-brand-dark border border-brand-border rounded-lg">
                            <option value="">Unassigned</option>
                            {users.map((user: User) => <option key={user.id} value={user.id}>{user.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-brand-text-secondary mb-1">Due Date</label>
                        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full p-2 bg-brand-dark border border-brand-border rounded-lg" required />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-brand-text-secondary mb-1">Status</label>
                    <select value={status} onChange={e => setStatus(e.target.value as TaskStatus)} className="w-full p-2 bg-brand-dark border border-brand-border rounded-lg">
                        {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div className="pt-4 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-brand-border text-brand-text font-semibold rounded-lg">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-brand-accent text-brand-dark font-bold rounded-lg">Save Changes</button>
                </div>
            </form>
        </Modal>
    );
};


// --- SUB-COMPONENTS FOR TABS ---

const UserManagement: React.FC = () => {
    const { users, setUsers, addUser } = useData();
    const [newUser, setNewUser] = useState({ name: '', email: '', role: UserRole.Engineer });

    const handleRoleChange = (userId: string, newRole: UserRole) => {
        setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, role: newRole } : u));
    };

    const handleRemoveUser = (userId: string) => {
        if (window.confirm("Are you sure you want to remove this user? This action cannot be undone.")) {
            setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
        }
    };

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        if(!newUser.name || !newUser.email) return;
        addUser(newUser);
        setNewUser({ name: '', email: '', role: UserRole.Engineer });
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold text-brand-text mb-4">Manage Team Members</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                    {users.map(user => (
                        <div key={user.id} className="p-3 bg-brand-dark rounded-lg flex flex-col md:flex-row justify-between items-center gap-2 border border-brand-border">
                            <div className="flex items-center">
                                <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full mr-3 object-cover" />
                                <div>
                                    <p className="font-semibold text-brand-text">{user.name}</p>
                                    <p className="text-sm text-brand-text-secondary">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <select
                                    value={user.role}
                                    onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                                    className="p-2 border border-brand-border bg-brand-dark rounded-lg text-sm"
                                    disabled={user.role === UserRole.Manager}
                                >
                                    {Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
                                </select>
                                <button
                                    onClick={() => handleRemoveUser(user.id)}
                                    className="text-sm text-red-400 hover:underline p-2 disabled:text-gray-600"
                                    disabled={user.role === UserRole.Manager}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="border-t border-brand-border pt-6">
                 <h3 className="text-xl font-bold text-brand-text mb-4">Add New Member</h3>
                 <form onSubmit={handleAddUser} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1">
                        <label className="text-sm font-semibold text-brand-text-secondary">Name</label>
                        <input type="text" value={newUser.name} onChange={e => setNewUser(p => ({...p, name: e.target.value}))} placeholder="Full Name" required className="w-full mt-1 p-2 bg-brand-dark border border-brand-border rounded-lg"/>
                    </div>
                    <div className="flex-1">
                        <label className="text-sm font-semibold text-brand-text-secondary">Email</label>
                        <input type="email" value={newUser.email} onChange={e => setNewUser(p => ({...p, email: e.target.value}))} placeholder="user@saintolaves.net" required className="w-full mt-1 p-2 bg-brand-dark border border-brand-border rounded-lg"/>
                    </div>
                    <div className="flex-1">
                        <label className="text-sm font-semibold text-brand-text-secondary">Role</label>
                        <select value={newUser.role} onChange={e => setNewUser(p => ({...p, role: e.target.value as UserRole}))} className="w-full mt-1 p-2 bg-brand-dark border border-brand-border rounded-lg">
                             {Object.values(UserRole).filter(r => r !== UserRole.Manager).map(role => <option key={role} value={role}>{role}</option>)}
                        </select>
                    </div>
                    <button type="submit" className="bg-brand-accent text-brand-dark font-bold py-2 px-4 rounded-lg hover:bg-brand-accent-hover flex items-center gap-2"><PlusCircleIcon className="w-5 h-5"/> Add Member</button>
                 </form>
            </div>
        </div>
    )
}

const FinancialCommand: React.FC = () => {
    const { finances, addFinancialRecord, deleteFinancialRecord } = useData();
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState<'income' | 'expense'>('expense');

    const { income, expenses, net } = useMemo(() => {
        const income = finances.filter(f => f.type === 'income').reduce((sum, f) => sum + f.amount, 0);
        const expenses = finances.filter(f => f.type === 'expense').reduce((sum, f) => sum + f.amount, 0);
        return { income, expenses, net: income - expenses };
    }, [finances]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || !amount) return;
        addFinancialRecord({ description, amount: parseFloat(amount), type });
        setDescription('');
        setAmount('');
    };

    const handleDelete = (recordId: string) => {
        if (window.confirm("Are you sure you want to delete this financial record?")) {
            deleteFinancialRecord(recordId);
        }
    };

    const maxVal = Math.max(income, expenses, 1);

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold text-brand-text mb-4">Financial Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-center">
                    <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20"><p className="text-sm text-green-300">Total Income</p><p className="text-2xl font-bold text-green-400">${income.toLocaleString()}</p></div>
                    <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20"><p className="text-sm text-red-300">Total Expenses</p><p className="text-2xl font-bold text-red-400">${expenses.toLocaleString()}</p></div>
                    <div className={`p-4 rounded-lg border ${net >= 0 ? 'bg-blue-500/10 border-blue-500/20' : 'bg-yellow-500/10 border-yellow-500/20'}`}><p className={`text-sm ${net >= 0 ? 'text-blue-300' : 'text-yellow-300'}`}>Net Profit</p><p className={`text-2xl font-bold ${net >= 0 ? 'text-blue-400' : 'text-yellow-400'}`}>${net.toLocaleString()}</p></div>
                </div>
                 <div className="relative h-40 bg-brand-dark rounded-lg flex items-end gap-4 p-4 border border-brand-border">
                    <div className="flex-1 flex flex-col items-center h-full justify-end">
                        <div className="w-1/2 bg-green-500 rounded-t transition-all duration-500" style={{ height: `${(income / maxVal) * 100}%` }}></div>
                        <p className="text-xs font-semibold text-green-400 mt-1">Income</p>
                    </div>
                    <div className="flex-1 flex flex-col items-center h-full justify-end">
                        <div className="w-1/2 bg-red-500 rounded-t transition-all duration-500" style={{ height: `${(expenses / maxVal) * 100}%` }}></div>
                        <p className="text-xs font-semibold text-red-400 mt-1">Expense</p>
                    </div>
                </div>
            </div>
             <div className="border-t border-brand-border pt-6">
                 <h3 className="text-xl font-bold text-brand-text mb-4">Add Financial Record</h3>
                 <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-grow">
                        <label className="text-sm font-semibold text-brand-text-secondary">Description</label>
                        <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g., Carbon Fiber Order" required className="w-full mt-1 p-2 bg-brand-dark border border-brand-border rounded-lg"/>
                    </div>
                    <div>
                         <label className="text-sm font-semibold text-brand-text-secondary">Amount ($)</label>
                        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="15000" required className="w-full mt-1 p-2 bg-brand-dark border border-brand-border rounded-lg"/>
                    </div>
                     <div>
                         <label className="text-sm font-semibold text-brand-text-secondary">Type</label>
                        <select value={type} onChange={e => setType(e.target.value as any)} className="w-full mt-1 p-2 bg-brand-dark border border-brand-border rounded-lg">
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                        </select>
                    </div>
                    <button type="submit" className="bg-brand-accent text-brand-dark font-bold py-2 px-4 rounded-lg hover:bg-brand-accent-hover flex items-center gap-2"><PlusCircleIcon className="w-5 h-5"/> Add Record</button>
                 </form>
            </div>
             <div className="border-t border-brand-border pt-6">
                 <h3 className="text-xl font-bold text-brand-text mb-4">Transaction History</h3>
                 <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                     {finances.map(record => (
                         <div key={record.id} className="p-3 bg-brand-dark rounded-lg flex justify-between items-center border border-brand-border">
                            <div>
                                <p className="font-semibold">{record.description}</p>
                                <p className="text-sm text-brand-text-secondary">{new Date(record.date).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`font-bold ${record.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                                    {record.type === 'income' ? '+' : '-'}${record.amount.toLocaleString()}
                                </span>
                                <button onClick={() => handleDelete(record.id)} className="text-red-400 p-1 rounded-full hover:bg-red-500/20"><TrashIcon className="w-4 h-4"/></button>
                            </div>
                         </div>
                     ))}
                 </div>
            </div>
        </div>
    )
}

const PieChart: React.FC<{data: {label: string, value: number, color: string}[]}> = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return <div className="text-center text-brand-text-secondary p-4">No data to display.</div>;
    
    let cumulativePercent = 0;
    const gradients = data.map(item => {
        const percent = (item.value / total) * 100;
        const start = cumulativePercent;
        cumulativePercent += percent;
        return `${item.color} ${start}% ${cumulativePercent}%`;
    });

    return (
        <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32 rounded-full" style={{background: `conic-gradient(${gradients.join(', ')})`}}></div>
            <div className="space-y-2">
                {data.map(item => (
                    <div key={item.label} className="flex items-center text-sm">
                        <span className="w-3 h-3 rounded-sm mr-2" style={{backgroundColor: item.color}}></span>
                        <span className="font-semibold text-brand-text">{item.label}:</span>
                        <span className="ml-2 text-brand-text-secondary">{item.value} tasks ({((item.value/total)*100).toFixed(0)}%)</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ProjectAnalytics: React.FC = () => {
    const { tasks, users } = useData();

    const taskStatusCounts = useMemo(() => {
        return tasks.reduce((acc, task) => {
            acc[task.status] = (acc[task.status] || 0) + 1;
            return acc;
        }, {} as Record<TaskStatus, number>);
    }, [tasks]);

    const chartData = [
        { label: TaskStatus.ToDo, value: taskStatusCounts[TaskStatus.ToDo] || 0, color: '#FBBF24' },
        { label: TaskStatus.InProgress, value: taskStatusCounts[TaskStatus.InProgress] || 0, color: '#60A5FA' },
        { label: TaskStatus.InReview, value: taskStatusCounts[TaskStatus.InReview] || 0, color: '#A78BFA' },
        { label: TaskStatus.Done, value: taskStatusCounts[TaskStatus.Done] || 0, color: '#4ADE80' },
    ];
    
    const contributionData = useMemo(() => {
        const counts: Record<string, number> = {};
        tasks.forEach(task => {
            if (task.status === TaskStatus.Done && task.assigneeId) {
                counts[task.assigneeId] = (counts[task.assigneeId] || 0) + 1;
            }
        });
        
        return Object.entries(counts)
            .map(([userId, count]) => {
                const user = users.find(u => u.id === userId);
                return {
                    user,
                    count
                };
            })
            .filter(item => !!item.user)
            .sort((a, b) => b.count - a.count);

    }, [tasks, users]);

    return (
         <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold text-brand-text mb-4">Task Status Distribution</h3>
                <PieChart data={chartData} />
            </div>
             <div className="border-t border-brand-border pt-6">
                 <h3 className="text-xl font-bold text-brand-text mb-4">Contribution Leaderboard</h3>
                 <p className="text-sm text-brand-text-secondary mb-3">Ranking based on completed tasks.</p>
                 <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                     {contributionData.map((item, index) => (
                        <div key={item.user!.id} className="p-3 bg-brand-dark rounded-lg border border-brand-border flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-lg w-6 text-center">{index + 1}</span>
                                <img src={item.user!.avatarUrl} alt={item.user!.name} className="w-10 h-10 rounded-full object-cover"/>
                                <div>
                                    <p className="font-semibold text-brand-text">{item.user!.name}</p>
                                    <p className="text-sm text-brand-text-secondary">{item.user!.role}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                               {index === 0 && <TrophyIcon className="w-5 h-5 text-yellow-400" />}
                               <span className="font-bold text-xl text-brand-text">{item.count}</span>
                               <span className="text-sm text-brand-text-secondary">tasks</span>
                            </div>
                        </div>
                     ))}
                     {contributionData.length === 0 && <p className="text-brand-text-secondary text-center p-4">No tasks have been completed yet.</p>}
                 </div>
            </div>
        </div>
    )
};

const TaskControl: React.FC = () => {
    const { tasks, getTeamMember, deleteTask } = useData();
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const handleDelete = (taskId: string) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            deleteTask(taskId);
        }
    };

    const statusColors: { [key in TaskStatus]: string } = {
        [TaskStatus.ToDo]: 'border-yellow-400/50',
        [TaskStatus.InProgress]: 'border-blue-400/50',
        [TaskStatus.InReview]: 'border-purple-400/50',
        [TaskStatus.Done]: 'border-green-400/50',
    };

    return (
        <div className="space-y-4">
            {editingTask && <EditTaskModal isOpen={!!editingTask} onClose={() => setEditingTask(null)} task={editingTask} />}
            <h3 className="text-xl font-bold text-brand-text">All Tasks</h3>
            <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-2">
                {tasks.map(task => {
                    const assignee = task.assigneeId ? getTeamMember(task.assigneeId) : null;
                    return (
                        <div key={task.id} className={`p-3 bg-brand-dark rounded-lg border-l-4 ${statusColors[task.status]}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-brand-text">{task.title}</p>
                                    <p className="text-sm text-brand-text-secondary">{task.description}</p>
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                    <button onClick={() => setEditingTask(task)} className="text-sm text-brand-accent hover:underline">Edit</button>
                                    <button onClick={() => handleDelete(task.id)} className="text-sm text-red-400 hover:underline">Delete</button>
                                </div>
                            </div>
                             <div className="text-xs text-brand-text-secondary mt-2 flex items-center gap-4">
                                <span>Status: <span className="font-semibold">{task.status}</span></span>
                                <span>Due: <span className="font-semibold">{task.dueDate}</span></span>
                                {assignee && <span>Assignee: <span className="font-semibold">{assignee.name}</span></span>}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

const SponsorshipHub: React.FC = () => {
    const { sponsors, addSponsor, updateSponsorStatus, deleteSponsor } = useData();
    const [newSponsor, setNewSponsor] = useState({ name: '', tier: SponsorTier.Bronze });

    const handleAddSponsor = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSponsor.name) return;
        addSponsor(newSponsor);
        setNewSponsor({ name: '', tier: SponsorTier.Bronze });
    };

    const handleDelete = (sponsorId: string) => {
        if (window.confirm("Are you sure you want to remove this sponsor?")) {
            deleteSponsor(sponsorId);
        }
    }

    return (
         <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold text-brand-text mb-4">Sponsorship Pipeline</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                    {sponsors.map(sponsor => (
                        <div key={sponsor.id} className="p-3 bg-brand-dark rounded-lg flex justify-between items-center border border-brand-border">
                            <div className="flex items-center">
                                <div className="h-10 w-20 flex items-center justify-center mr-4 bg-white/5 p-1 rounded">
                                    <img src={sponsor.logoUrl} alt={sponsor.name} className="h-full w-auto object-contain" />
                                </div>
                                <div>
                                    <p className="font-semibold text-brand-text">{sponsor.name}</p>
                                    <p className="text-sm text-brand-text-secondary">{sponsor.tier}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <select
                                    value={sponsor.status}
                                    onChange={e => updateSponsorStatus(sponsor.id, e.target.value as any)}
                                    className={`p-2 border rounded-lg text-sm bg-brand-dark ${sponsor.status === 'secured' ? 'border-green-500/30 text-green-400' : 'border-yellow-500/30 text-yellow-400'}`}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="secured">Secured</option>
                                </select>
                                <button onClick={() => handleDelete(sponsor.id)} className="text-red-400 p-1 rounded-full hover:bg-red-500/20"><TrashIcon className="w-4 h-4"/></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="border-t border-brand-border pt-6">
                 <h3 className="text-xl font-bold text-brand-text mb-4">Add Potential Sponsor</h3>
                 <form onSubmit={handleAddSponsor} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-grow">
                        <label className="text-sm font-semibold text-brand-text-secondary">Company Name</label>
                        <input type="text" value={newSponsor.name} onChange={e => setNewSponsor(p => ({...p, name: e.target.value}))} placeholder="e.g., Velocity Parts" required className="w-full mt-1 p-2 bg-brand-dark border border-brand-border rounded-lg"/>
                    </div>
                    <div>
                         <label className="text-sm font-semibold text-brand-text-secondary">Tier</label>
                        <select value={newSponsor.tier} onChange={e => setNewSponsor(p => ({...p, tier: e.target.value as SponsorTier}))} className="w-full mt-1 p-2 bg-brand-dark border border-brand-border rounded-lg">
                             {Object.values(SponsorTier).map(tier => <option key={tier} value={tier}>{tier}</option>)}
                        </select>
                    </div>
                    <button type="submit" className="bg-brand-accent text-brand-dark font-bold py-2 px-4 rounded-lg hover:bg-brand-accent-hover flex items-center gap-2"><PlusCircleIcon className="w-5 h-5"/> Add Sponsor</button>
                 </form>
            </div>
        </div>
    )
};

const ContentManagement: React.FC = () => {
    const { 
        news, addNewsPost, updateNewsPost, deleteNewsPost, 
        carHighlights, addCarHighlight, updateCarHighlight, deleteCarHighlight 
    } = useData();
    
    // News State
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostContent, setNewPostContent] = useState('');
    const [newPostIsPublic, setNewPostIsPublic] = useState(true);

    // Highlights State
    const [newHighlightTitle, setNewHighlightTitle] = useState('');
    const [newHighlightDesc, setNewHighlightDesc] = useState('');
    const [newHighlightIsPublic, setNewHighlightIsPublic] = useState(true);

    const handleAddPost = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPostTitle || !newPostContent) return;
        addNewsPost({ title: newPostTitle, content: newPostContent, isPublic: newPostIsPublic });
        setNewPostTitle('');
        setNewPostContent('');
    };
    
    const handleAddHighlight = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newHighlightTitle || !newHighlightDesc) return;
        addCarHighlight({ title: newHighlightTitle, description: newHighlightDesc, isPublic: newHighlightIsPublic });
        setNewHighlightTitle('');
        setNewHighlightDesc('');
    };

    return (
        <div className="space-y-8">
            {/* News Management */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-brand-text">Manage News Posts</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2 border-b border-brand-border pb-4">
                    {news.map(post => (
                        <div key={post.id} className="p-3 bg-brand-dark rounded-lg border border-brand-border">
                            <p className="font-semibold">{post.title}</p>
                            <div className="flex items-center gap-4 mt-2">
                                <label className="flex items-center text-sm gap-2 cursor-pointer">
                                    <input type="checkbox" checked={post.isPublic} onChange={(e) => updateNewsPost({...post, isPublic: e.target.checked})} className="accent-brand-accent"/>
                                    Public
                                </label>
                                <button onClick={() => deleteNewsPost(post.id)} className="text-sm text-red-400 hover:underline">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
                <form onSubmit={handleAddPost} className="space-y-2 pt-4">
                    <h4 className="font-semibold text-brand-text">Add New Post</h4>
                    <input type="text" placeholder="Post Title" value={newPostTitle} onChange={e => setNewPostTitle(e.target.value)} required className="w-full p-2 bg-brand-dark border border-brand-border rounded-lg" />
                    <textarea placeholder="Post Content..." value={newPostContent} onChange={e => setNewPostContent(e.target.value)} required rows={3} className="w-full p-2 bg-brand-dark border border-brand-border rounded-lg" />
                    <div className="flex justify-between items-center">
                        <label className="flex items-center text-sm gap-2 cursor-pointer">
                            <input type="checkbox" checked={newPostIsPublic} onChange={(e) => setNewPostIsPublic(e.target.checked)} className="accent-brand-accent"/>
                            Make Public
                        </label>
                        <button type="submit" className="bg-brand-accent text-brand-dark font-bold py-2 px-4 rounded-lg hover:bg-brand-accent-hover">Add Post</button>
                    </div>
                </form>
            </div>
            
            {/* Car Highlights Management */}
            <div className="space-y-4 border-t border-brand-border pt-8">
                <h3 className="text-xl font-bold text-brand-text">Manage Car Highlights</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2 border-b border-brand-border pb-4">
                     {carHighlights.map(h => (
                        <div key={h.id} className="p-3 bg-brand-dark rounded-lg border border-brand-border">
                            <p className="font-semibold">{h.title}</p>
                            <div className="flex items-center gap-4 mt-2">
                                <label className="flex items-center text-sm gap-2 cursor-pointer">
                                    <input type="checkbox" checked={h.isPublic} onChange={(e) => updateCarHighlight({...h, isPublic: e.target.checked})} className="accent-brand-accent" />
                                    Public
                                </label>
                                <button onClick={() => deleteCarHighlight(h.id)} className="text-sm text-red-400 hover:underline">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
                 <form onSubmit={handleAddHighlight} className="space-y-2 pt-4">
                    <h4 className="font-semibold text-brand-text">Add New Highlight</h4>
                    <input type="text" placeholder="Highlight Title" value={newHighlightTitle} onChange={e => setNewHighlightTitle(e.target.value)} required className="w-full p-2 bg-brand-dark border border-brand-border rounded-lg" />
                    <textarea placeholder="Description..." value={newHighlightDesc} onChange={e => setNewHighlightDesc(e.target.value)} required rows={3} className="w-full p-2 bg-brand-dark border border-brand-border rounded-lg" />
                    <div className="flex justify-between items-center">
                        <label className="flex items-center text-sm gap-2 cursor-pointer">
                            <input type="checkbox" checked={newHighlightIsPublic} onChange={(e) => setNewHighlightIsPublic(e.target.checked)} className="accent-brand-accent"/>
                            Make Public
                        </label>
                        <button type="submit" className="bg-brand-accent text-brand-dark font-bold py-2 px-4 rounded-lg hover:bg-brand-accent-hover">Add Highlight</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const CompetitionManagement: React.FC = () => {
    const { competitionProgress, updateCompetitionProgress } = useData();
    const [progress, setProgress] = useState<CompetitionProgressItem[]>(competitionProgress);

    const handleProgressChange = (index: number, value: number) => {
        const newProgress = [...progress];
        newProgress[index].progress = value;
        setProgress(newProgress);
    };

    const handleSave = () => {
        updateCompetitionProgress(progress);
        alert("Competition progress saved!");
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold text-brand-text mb-4">Competition Progress Tracker</h3>
                <p className="text-sm text-brand-text-secondary mb-4">Adjust the sliders to update the team's progress on the main dashboard.</p>
                <div className="space-y-4">
                    {progress.map((item, index) => (
                        <div key={item.category}>
                            <label className="block text-sm font-semibold text-brand-text-secondary mb-1">{item.category}: {item.progress}%</label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={item.progress}
                                onChange={(e) => handleProgressChange(index, parseInt(e.target.value))}
                                className="w-full h-2 bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-accent"
                            />
                        </div>
                    ))}
                </div>
                <button onClick={handleSave} className="mt-6 bg-brand-accent text-brand-dark font-bold py-2 px-4 rounded-lg hover:bg-brand-accent-hover">
                    Save Progress
                </button>
            </div>
        </div>
    );
};

const ProtocolManagement: React.FC = () => {
    const { protocols, addProtocol, updateProtocol, deleteProtocol } = useData();
    const [editingProtocol, setEditingProtocol] = useState<Protocol | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddNew = () => {
        setEditingProtocol({ id: '', title: '', description: '', steps: ['']});
        setIsModalOpen(true);
    };

    const handleEdit = (protocol: Protocol) => {
        setEditingProtocol(protocol);
        setIsModalOpen(true);
    };

    const handleDelete = (protocolId: string) => {
        if(window.confirm('Are you sure you want to delete this protocol?')) {
            deleteProtocol(protocolId);
        }
    };

    const handleSave = (protocolToSave: Protocol) => {
        if(protocolToSave.id) {
            updateProtocol(protocolToSave);
        } else {
            addProtocol({
                title: protocolToSave.title,
                description: protocolToSave.description,
                steps: protocolToSave.steps
            });
        }
        setIsModalOpen(false);
        setEditingProtocol(null);
    };

    const ProtocolEditorModal = () => {
        const [protocol, setProtocol] = useState(editingProtocol!);

        const handleStepChange = (index: number, value: string) => {
            const newSteps = [...protocol.steps];
            newSteps[index] = value;
            setProtocol(p => ({...p!, steps: newSteps}));
        };

        const addStep = () => {
            setProtocol(p => ({...p!, steps: [...p!.steps, '']}));
        }

        const removeStep = (index: number) => {
             setProtocol(p => ({...p!, steps: p!.steps.filter((_, i) => i !== index)}));
        }

        return (
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={protocol.id ? 'Edit Protocol' : 'Create New Protocol'}>
                <div className="space-y-4">
                     <input type="text" placeholder="Protocol Title" value={protocol.title} onChange={e => setProtocol(p => ({...p!, title: e.target.value}))} className="w-full p-2 bg-brand-dark border border-brand-border rounded-md"/>
                     <textarea placeholder="Description" value={protocol.description} onChange={e => setProtocol(p => ({...p!, description: e.target.value}))} rows={2} className="w-full p-2 bg-brand-dark border border-brand-border rounded-md"/>
                    <div className="space-y-2">
                        <h4 className="font-semibold text-brand-text-secondary">Steps</h4>
                        {protocol.steps.map((step, index) => (
                             <div key={index} className="flex items-center gap-2">
                                <input type="text" value={step} onChange={e => handleStepChange(index, e.target.value)} className="w-full p-2 bg-brand-dark border border-brand-border rounded-md"/>
                                <button onClick={() => removeStep(index)} className="text-red-400 p-1 rounded-full hover:bg-red-500/20"><TrashIcon className="w-4 h-4"/></button>
                            </div>
                        ))}
                         <button onClick={addStep} className="text-sm text-brand-accent hover:underline">+ Add Step</button>
                    </div>
                    <div className="flex justify-end">
                        <button onClick={() => handleSave(protocol)} className="bg-brand-accent text-brand-dark font-bold py-2 px-4 rounded-lg hover:bg-brand-accent-hover">Save Protocol</button>
                    </div>
                </div>
            </Modal>
        )
    };

    return (
        <div className="space-y-4">
            {isModalOpen && editingProtocol && <ProtocolEditorModal />}
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-brand-text">Manage Protocols</h3>
                <button onClick={handleAddNew} className="bg-brand-accent text-brand-dark font-bold py-2 px-4 rounded-lg hover:bg-brand-accent-hover flex items-center gap-2"><PlusCircleIcon className="w-5 h-5"/> Add Protocol</button>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                {protocols.map(p => (
                    <div key={p.id} className="p-3 bg-brand-dark rounded-lg flex justify-between items-center border border-brand-border">
                        <div>
                            <p className="font-semibold text-brand-text">{p.title}</p>
                            <p className="text-sm text-brand-text-secondary">{p.steps.length} steps</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handleEdit(p)} className="text-sm text-brand-accent hover:underline">Edit</button>
                             <button onClick={() => handleDelete(p.id)} className="text-sm text-red-400 hover:underline">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const HQSettings: React.FC = () => {
    const { announcement, setAnnouncement, competitionDate, setCompetitionDate, teamLogoUrl, setTeamLogoUrl } = useAppState();
    const data = useData();
    const [newAnnouncement, setNewAnnouncement] = useState(announcement || '');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const logoInputRef = useRef<HTMLInputElement>(null);

    const handleSetAnnouncement = () => {
        setAnnouncement(newAnnouncement);
        alert("Announcement updated!");
    };
    
    const handleExport = () => {
        const exportedData = {
            users: data.users,
            tasks: data.tasks,
            aeroResults: data.aeroResults,
            finances: data.finances,
            sponsors: data.sponsors,
            news: data.news,
            carHighlights: data.carHighlights,
            discussionThreads: data.discussionThreads,
            announcement: announcement,
            competitionDate: competitionDate,
            competitionProgress: data.competitionProgress,
            protocols: data.protocols,
            teamLogoUrl: teamLogoUrl,
        };
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(exportedData, null, 2))}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = `blizzard-hq-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') throw new Error("File is not readable");
                const importedData = JSON.parse(text);
                 if (window.confirm("Are you sure you want to import this data? This will overwrite all current HQ data.")) {
                    data.loadData(importedData);
                    alert("Data imported successfully!");
                 }
            } catch (error) {
                console.error("Failed to parse imported file:", error);
                alert("Failed to import data. The file may be corrupt or incorrectly formatted.");
            } finally {
                if (fileInputRef.current) fileInputRef.current.value = "";
            }
        };
        reader.readAsText(file);
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setTeamLogoUrl(reader.result as string);
                alert("Logo updated successfully!");
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold text-brand-text mb-4">Global Announcement</h3>
                <p className="text-sm text-brand-text-secondary mb-2">Set a banner message visible to all team members upon login.</p>
                <div className="flex gap-2">
                    <input type="text" value={newAnnouncement} onChange={e => setNewAnnouncement(e.target.value)} placeholder="Enter announcement..." className="w-full p-2 bg-brand-dark border border-brand-border rounded-lg"/>
                    <button onClick={handleSetAnnouncement} className="bg-brand-accent text-brand-dark font-bold py-2 px-4 rounded-lg hover:bg-brand-accent-hover">Set</button>
                </div>
            </div>
             <div className="border-t border-brand-border pt-6">
                 <h3 className="text-xl font-bold text-brand-text mb-4">Competition Date</h3>
                 <p className="text-sm text-brand-text-secondary mb-2">Set the official date and time for the next competition. This will update the countdown on the main dashboard.</p>
                <input 
                    type="datetime-local"
                    value={competitionDate || ''}
                    onChange={(e) => setCompetitionDate(e.target.value)}
                    className="p-2 bg-brand-dark border border-brand-border rounded-lg"
                />
            </div>
             <div className="border-t border-brand-border pt-6">
                <h3 className="text-xl font-bold text-brand-text mb-4">Team Logo</h3>
                <p className="text-sm text-brand-text-secondary mb-4">Upload a new logo for the team. It will be displayed on a white background in the sidebar.</p>
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-white rounded-md flex items-center justify-center p-2 border border-brand-border">
                        <img src={teamLogoUrl} alt="Team Logo" className="max-w-full max-h-full object-contain" />
                    </div>
                    <input type="file" ref={logoInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
                    <button onClick={() => logoInputRef.current?.click()} className="bg-brand-surface hover:bg-brand-border text-brand-text font-semibold px-4 py-2 rounded-lg flex items-center gap-2">
                        <UploadIcon className="w-5 h-5"/> Upload New Logo
                    </button>
                </div>
            </div>
             <div className="border-t border-brand-border pt-6">
                 <h3 className="text-xl font-bold text-brand-text mb-4">Data Management</h3>
                 <p className="text-sm text-brand-text-secondary mb-4">Export a backup of all application data, or import a file to restore state.</p>
                 <div className="flex gap-4">
                     <button onClick={handleExport} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 flex items-center gap-2"><DownloadIcon className="w-5 h-5"/> Export All Data</button>
                     <button onClick={() => fileInputRef.current?.click()} className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 flex items-center gap-2"><UploadIcon className="w-5 h-5"/> Import Data</button>
                     <input type="file" ref={fileInputRef} onChange={handleImport} accept=".json" className="hidden" />
                 </div>
                 <p className="text-xs text-red-400 mt-2">Warning: Importing data will overwrite everything currently in the HQ.</p>
            </div>
        </div>
    );
};


// --- MAIN PANEL PAGE ---

type Tab = 'team' | 'finance' | 'projects' | 'tasks' | 'sponsors' | 'content' | 'competition' | 'protocols' | 'settings';

const ManagerPanelPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('team');
    
    const tabs: {id: Tab, name: string, icon: React.ReactNode}[] = [
        { id: 'team', name: 'Team', icon: <UsersIcon className="w-5 h-5" /> },
        { id: 'finance', name: 'Finance', icon: <DollarSignIcon className="w-5 h-5" /> },
        { id: 'projects', name: 'Project Analytics', icon: <PieChartIcon className="w-5 h-5" /> },
        { id: 'tasks', name: 'Task Control', icon: <ClipboardListIcon className="w-5 h-5" /> },
        { id: 'sponsors', name: 'Sponsors', icon: <TrophyIcon className="w-5 h-5" /> },
        { id: 'content', name: 'Content', icon: <NewspaperIcon className="w-5 h-5" /> },
        { id: 'competition', name: 'Competition', icon: <FlagIcon className="w-5 h-5" /> },
        { id: 'protocols', name: 'Protocols', icon: <FileCheckIcon className="w-5 h-5" /> },
        { id: 'settings', name: 'HQ Settings', icon: <Settings2Icon className="w-5 h-5" /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'team': return <UserManagement />;
            case 'finance': return <FinancialCommand />;
            case 'projects': return <ProjectAnalytics />;
            case 'tasks': return <TaskControl />;
            case 'sponsors': return <SponsorshipHub />;
            case 'content': return <ContentManagement />;
            case 'competition': return <CompetitionManagement />;
            case 'protocols': return <ProtocolManagement />;
            case 'settings': return <HQSettings />;
            default: return null;
        }
    }

    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-brand-text mb-2">Manager Command Center</h1>
            <p className="text-brand-text-secondary mb-6">Oversee all team operations from a single dashboard.</p>
            
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/4">
                    <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
                        {tabs.map(tab => (
                             <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 w-full flex-shrink-0 text-left p-3 rounded-lg font-semibold transition-colors ${
                                    activeTab === tab.id ? 'bg-brand-accent text-brand-dark' : 'text-brand-text-secondary hover:bg-brand-dark-secondary'
                                }`}
                            >
                                {tab.icon}
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="lg:w-3/4">
                    <div className="bg-brand-dark-secondary p-6 rounded-xl shadow-md border border-brand-border min-h-[60vh]">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerPanelPage;