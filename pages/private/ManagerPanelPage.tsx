
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useData, useAppState } from '../../contexts/AppContext';
import { UserRole, TaskStatus, SponsorTier, User, NewsPost, CarHighlight, CompetitionProgressItem, Protocol, Task, PortfolioAuditReport } from '../../types';
import { UsersIcon, DollarSignIcon, ClipboardListIcon, TrophyIcon, Settings2Icon, PieChartIcon, PlusCircleIcon, DownloadIcon, UploadIcon, NewspaperIcon, FlagIcon, FileCheckIcon, TrashIcon, BarChartIcon, AlertTriangleIcon, UploadCloudIcon, KeyIcon, InfoIcon, ShieldCheckIcon, SparklesIcon, CheckCircleIcon } from '../../components/icons';
import Modal from '../../components/shared/Modal';
import { portfolioAiService } from '../../services/portfolioAiService';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

// --- AUDIT COMPONENT ---
const PortfolioAuditor: React.FC = () => {
    const data = useData();
    const { announcement, competitionDate, teamLogoUrl } = useAppState();
    const [report, setReport] = useState<PortfolioAuditReport | null>(null);
    const [isAuditing, setIsAuditing] = useState(false);

    const runAudit = async () => {
        setIsAuditing(true);
        try {
            // Fix: Combine DataContext with AppState to satisfy the AppStore type requirement by including missing fields.
            const storeForAudit = {
                ...data,
                announcement,
                competitionDate,
                teamLogoUrl
            };
            const result = await portfolioAiService.analyzeTeamReadiness(storeForAudit as any);
            setReport(result);
        } catch (e) {
            alert("Audit failed. Ensure you have a working internet connection.");
        } finally {
            setIsAuditing(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="text-2xl font-bold text-brand-text flex items-center gap-3">
                        <ShieldCheckIcon className="w-8 h-8 text-brand-accent" />
                        Official Mark Auditor
                    </h3>
                    <p className="text-brand-text-secondary text-sm">AI-driven analysis using official Development Class marking rubrics.</p>
                </div>
                <button 
                    onClick={runAudit}
                    disabled={isAuditing}
                    className="bg-brand-accent text-brand-dark font-bold px-6 py-3 rounded-xl hover:bg-brand-accent-hover transition-all flex items-center gap-2 shadow-glow-accent disabled:opacity-50"
                >
                    {isAuditing ? <LoadingSpinner /> : <SparklesIcon className="w-5 h-5" />}
                    {isAuditing ? 'Analyzing Evidence...' : 'Run Official Audit'}
                </button>
            </div>

            {report ? (
                <div className="space-y-6">
                    {/* Overall Score */}
                    <div className="bg-brand-dark p-8 rounded-2xl border border-brand-border text-center">
                        <p className="text-sm font-bold text-brand-text-secondary uppercase tracking-widest mb-2">Estimated Competition Readiness</p>
                        <div className="text-6xl font-black text-brand-accent mb-4">{report.overallReadiness}%</div>
                        <div className="w-full max-w-md mx-auto bg-brand-dark-secondary h-3 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-accent" style={{ width: `${report.overallReadiness}%` }}></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {report.categories.map((cat, i) => (
                            <div key={i} className="bg-brand-dark-secondary p-6 rounded-xl border border-brand-border">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-bold text-brand-text text-lg">{cat.title}</h4>
                                    <span className={`font-mono font-bold ${cat.score > 75 ? 'text-green-400' : cat.score > 50 ? 'text-yellow-400' : 'text-red-400'}`}>{cat.score}/100</span>
                                </div>
                                <p className="text-sm text-brand-text-secondary mb-4 leading-relaxed">{cat.feedback}</p>
                                
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] font-bold text-green-400 uppercase mb-2">Strengths (Evidence Found)</p>
                                        <ul className="space-y-1">
                                            {cat.strengths.map((s, idx) => (
                                                <li key={idx} className="text-xs text-brand-text-secondary flex items-start gap-2">
                                                    <div className="w-1 h-1 bg-green-400 rounded-full mt-1.5 flex-shrink-0" />
                                                    {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-yellow-400 uppercase mb-2">Critical Marks Missing</p>
                                        <ul className="space-y-1">
                                            {cat.missingEvidence.map((m, idx) => (
                                                <li key={idx} className="text-xs text-brand-text-secondary flex items-start gap-2">
                                                    <div className="w-1 h-1 bg-yellow-400 rounded-full mt-1.5 flex-shrink-0" />
                                                    {m}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Critical Risks */}
                    {report.criticalRisks.length > 0 && (
                        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl">
                            <h4 className="text-red-400 font-bold flex items-center gap-2 mb-3">
                                <AlertTriangleIcon className="w-5 h-5" />
                                REGULATION COMPLIANCE RISKS
                            </h4>
                            <ul className="list-disc list-inside space-y-1">
                                {report.criticalRisks.map((r, i) => (
                                    <li key={i} className="text-sm text-red-300">{r}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-20 bg-brand-dark rounded-2xl border border-brand-border border-dashed">
                    <TrophyIcon className="w-16 h-16 text-brand-border mb-4" />
                    <p className="text-brand-text-secondary font-medium">No audit data available. Run your first mark analysis above.</p>
                </div>
            )}
        </div>
    );
};

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

const CloudSyncSettings: React.FC = () => {
    const { syncId, setSyncId, pushToCloud, pullFromCloud, isSyncing } = useData();
    const [idInput, setIdInput] = useState(syncId || '');

    const handleConnect = () => {
        if (!idInput.trim()) return;
        setSyncId(idInput.trim());
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold text-brand-text mb-2">Global Team Sync</h3>
                <p className="text-brand-text-secondary text-sm mb-4">
                    Synchronize news, tasks, and aero results across all team devices.
                </p>
                
                <div className="bg-brand-dark p-4 rounded-lg border border-brand-border space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-brand-text-secondary uppercase mb-1">Team Channel ID</label>
                        <div className="flex gap-2">
                             <input 
                                type="text" 
                                value={idInput} 
                                onChange={e => setIdInput(e.target.value)} 
                                placeholder="Enter Channel ID..."
                                className="flex-grow p-2 bg-brand-dark-secondary border border-brand-border rounded-lg font-mono text-sm"
                            />
                            <button onClick={handleConnect} className="bg-brand-surface border border-brand-border px-4 py-2 rounded-lg text-sm font-bold hover:bg-brand-border transition-colors">Connect</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <button 
                            onClick={() => pushToCloud()}
                            disabled={isSyncing || !syncId}
                            className="flex items-center justify-center gap-2 bg-brand-accent text-brand-dark font-bold py-3 px-4 rounded-lg hover:bg-brand-accent-hover transition-colors disabled:opacity-50"
                        >
                            <UploadCloudIcon className={`w-5 h-5 ${isSyncing ? 'animate-bounce' : ''}`} />
                            Broadcast Changes
                        </button>
                        <button 
                            onClick={() => pullFromCloud()}
                            disabled={isSyncing || !syncId}
                            className="flex items-center justify-center gap-2 bg-brand-surface border border-brand-border text-brand-text font-bold py-3 px-4 rounded-lg hover:bg-brand-border transition-colors disabled:opacity-50"
                        >
                            <DownloadIcon className="w-5 h-5" />
                            Force Pull Data
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const UserManagement: React.FC = () => {
    const { users, setUsers, addUser } = useData();
    const [newUser, setNewUser] = useState({ name: '', email: '', role: UserRole.Engineer });

    const handleRoleChange = (userId: string, newRole: UserRole) => {
        setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, role: newRole } : u));
    };

    const handleRemoveUser = (userId: string) => {
        if (window.confirm("Are you sure you want to remove this user?")) {
            setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
        }
    };

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        if(!newUser.name || !newUser.email) return;
        const success = addUser(newUser);
        if (success) {
            setNewUser({ name: '', email: '', role: UserRole.Engineer });
        }
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
                                    disabled={user.role === UserRole.ProjectManager}
                                >
                                    {Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
                                </select>
                                <button
                                    onClick={() => handleRemoveUser(user.id)}
                                    className="text-sm text-red-400 hover:underline p-2 disabled:text-gray-600"
                                    disabled={user.role === UserRole.ProjectManager}
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
        if (window.confirm("Delete record?")) deleteFinancialRecord(recordId);
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold text-brand-text mb-4">Financial Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-center">
                    <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20"><p className="text-sm text-green-300">Total Income</p><p className="text-2xl font-bold text-green-400">${income.toLocaleString()}</p></div>
                    <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20"><p className="text-sm text-red-300">Total Expenses</p><p className="text-2xl font-bold text-red-400">${expenses.toLocaleString()}</p></div>
                    <div className={`p-4 rounded-lg border ${net >= 0 ? 'bg-blue-500/10 border-blue-500/20' : 'bg-yellow-500/10 border-yellow-500/20'}`}><p className={`text-sm ${net >= 0 ? 'text-blue-300' : 'text-yellow-300'}`}>Net Profit</p><p className={`text-2xl font-bold ${net >= 0 ? 'text-blue-400' : 'text-yellow-400'}`}>${net.toLocaleString()}</p></div>
                </div>
            </div>
             <div className="border-t border-brand-border pt-6">
                 <h3 className="text-xl font-bold text-brand-text mb-4">Add Transaction</h3>
                 <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
                    <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" required className="flex-grow p-2 bg-brand-dark border border-brand-border rounded-lg"/>
                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount ($)" required className="w-32 p-2 bg-brand-dark border border-brand-border rounded-lg"/>
                    <select value={type} onChange={e => setType(e.target.value as any)} className="p-2 bg-brand-dark border border-brand-border rounded-lg">
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>
                    <button type="submit" className="bg-brand-accent text-brand-dark font-bold py-2 px-4 rounded-lg hover:bg-brand-accent-hover flex items-center gap-2"><PlusCircleIcon className="w-5 h-5"/> Add</button>
                 </form>
            </div>
        </div>
    )
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
        alert("Progress saved!");
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-brand-text mb-4">Competition Readiness Sliders</h3>
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
    );
};

const AppSettings: React.FC = () => {
    const { announcement, setAnnouncement, competitionDate, setCompetitionDate, teamLogoUrl, setTeamLogoUrl } = useAppState();
    const { loadData } = useData();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => setTeamLogoUrl(reader.result as string);
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold text-brand-text mb-4">Global Announcement</h3>
                 <input type="text" value={announcement || ''} onChange={e => setAnnouncement(e.target.value)} placeholder="Critical updates for all team members..." className="w-full p-2 bg-brand-dark border border-brand-border rounded-lg"/>
                 <button onClick={() => setAnnouncement(null)} className="text-xs text-red-400 hover:underline mt-1">Clear Announcement</button>
            </div>
             <div className="border-t border-brand-border pt-6">
                <h3 className="text-xl font-bold text-brand-text mb-4">Competition Timeline</h3>
                 <input type="datetime-local" value={competitionDate || ''} onChange={e => setCompetitionDate(e.target.value)} className="w-full md:w-1/2 p-2 bg-brand-dark border border-brand-border rounded-lg"/>
            </div>
             <div className="border-t border-brand-border pt-6">
                <h3 className="text-xl font-bold text-brand-text mb-4">Branding</h3>
                <div className="flex items-center gap-4">
                    <div className="bg-white p-2 rounded-md border border-brand-border h-16 w-16 flex items-center justify-center">
                        <img src={teamLogoUrl} alt="Logo" className="h-full w-auto object-contain" />
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden"/>
                    <button onClick={() => fileInputRef.current?.click()} className="bg-brand-surface hover:bg-brand-border text-sm font-semibold px-4 py-2 rounded-lg">
                        Update Team Logo
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
type Tab = 'audit' | 'users' | 'cloud' | 'finances' | 'competition' | 'settings';

const ManagerPanelPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('audit');
    
    const tabs = [
        { id: 'audit', name: 'Portfolio Audit', icon: <ShieldCheckIcon className="w-5 h-5"/>, component: <PortfolioAuditor /> },
        { id: 'users', name: 'User Control', icon: <UsersIcon className="w-5 h-5"/>, component: <UserManagement /> },
        { id: 'cloud', name: 'Cloud Sync', icon: <UploadCloudIcon className="w-5 h-5"/>, component: <CloudSyncSettings /> },
        { id: 'finances', name: 'Financials', icon: <DollarSignIcon className="w-5 h-5"/>, component: <FinancialCommand /> },
        { id: 'competition', name: 'Marking Prep', icon: <FlagIcon className="w-5 h-5"/>, component: <CompetitionManagement /> },
        { id: 'settings', name: 'HQ Settings', icon: <Settings2Icon className="w-5 h-5"/>, component: <AppSettings /> },
    ];

    const activeComponent = tabs.find(tab => tab.id === activeTab)?.component;

    return (
        <div className="animate-fade-in pb-20">
            <h1 className="text-3xl font-bold text-brand-text mb-6">Manager Command Center</h1>
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/4">
                    <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as Tab)}
                                className={`flex items-center flex-shrink-0 gap-3 w-full text-left p-3 rounded-lg font-semibold transition-colors ${
                                    activeTab === tab.id ? 'bg-brand-accent text-brand-dark' : 'text-brand-text-secondary hover:bg-brand-dark-secondary border border-transparent hover:border-brand-border'
                                }`}
                            >
                                {tab.icon}
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="lg:w-3/4">
                    <div className="bg-brand-dark-secondary p-8 rounded-2xl shadow-xl border border-brand-border min-h-[60vh]">
                        {activeComponent}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerPanelPage;
