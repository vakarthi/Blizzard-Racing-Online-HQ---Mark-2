import React, { useEffect, useState, useMemo } from 'react';
import { useData, useAppState } from '../../contexts/AppContext';
import DashboardWidget from '../../components/hq/DashboardWidget';
import { ClipboardListIcon, TrophyIcon, UsersIcon, WindIcon, NewspaperIcon, ActivityIcon } from '../../components/icons';
import { TaskStatus } from '../../types';
import { Link } from 'react-router-dom';

const CountdownWidget: React.FC = () => {
    const { competitionDate } = useAppState();
    const targetDate = useMemo(() => competitionDate ? new Date(competitionDate) : null, [competitionDate]);
    const [timeLeft, setTimeLeft] = useState(targetDate ? targetDate.getTime() - new Date().getTime() : 0);

    useEffect(() => {
        if (!targetDate) return;
        const timer = setInterval(() => {
            setTimeLeft(targetDate.getTime() - new Date().getTime());
        }, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    if (!targetDate || isNaN(targetDate.getTime())) {
        return (
             <div className="text-center p-6 bg-brand-dark/50 rounded-xl border border-dashed border-yellow-500/30 text-brand-text">
                <h3 className="text-sm font-bold font-egghead text-yellow-500 mb-1">TARGET DATE MISSING</h3>
                <p className="text-xs text-brand-text-secondary">Manager authorization required to set Competition Date.</p>
            </div>
        )
    }

    const isPast = timeLeft < 0;
    const absTimeLeft = Math.abs(timeLeft);

    const days = Math.floor(absTimeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((absTimeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((absTimeLeft / 1000 / 60) % 60);
    const seconds = Math.floor((absTimeLeft / 1000) % 60);

    return (
        <div className="relative overflow-hidden p-6 rounded-xl border border-brand-accent/30 bg-gradient-to-r from-[#0B1121] to-[#020617] shadow-[0_0_30px_rgba(0,240,255,0.1)]">
            <div className="absolute top-0 right-0 p-2 opacity-20">
                <div className="w-32 h-1 bg-brand-accent blur-xl"></div>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
                <div className="text-center md:text-left">
                    <h3 className="text-xs font-bold font-egghead text-brand-accent tracking-[0.2em] uppercase mb-1">
                        {isPast ? "MISSION ACTIVE" : "T-MINUS TO LAUNCH"}
                    </h3>
                    <p className="text-[10px] text-brand-text-secondary font-mono">
                        SYNC: GLOBAL ATOMIC CLOCK
                    </p>
                </div>

                <div className="flex gap-4 md:gap-8">
                    {[
                        { label: 'DAYS', value: days },
                        { label: 'HOURS', value: hours },
                        { label: 'MINS', value: minutes },
                        { label: 'SECS', value: seconds }
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <div className="bg-black/40 border border-brand-border rounded px-3 py-2 min-w-[60px] text-center backdrop-blur-sm">
                                <span className="text-2xl md:text-4xl font-black font-egghead text-white tracking-tight">
                                    {item.value.toString().padStart(2, '0')}
                                </span>
                            </div>
                            <span className="text-[9px] font-bold text-brand-text-secondary mt-1 tracking-wider">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const CompetitionProgressWidget: React.FC = () => {
    const { competitionProgress } = useData();
    const colors = ['bg-brand-accent', 'bg-egghead-purple', 'bg-egghead-pink', 'bg-green-400', 'bg-yellow-400'];

    return (
        <DashboardWidget title="Readiness Levels" icon={<ActivityIcon className="w-4 h-4"/>} className="lg:col-span-2">
            <div className="space-y-5">
                {competitionProgress.map((item, index) => (
                    <div key={item.category}>
                        <div className="flex justify-between items-end mb-1.5">
                            <span className="text-xs font-bold text-brand-text font-display uppercase tracking-wider">{item.category}</span>
                            <span className="text-xs font-mono font-bold text-brand-accent">{item.progress}%</span>
                        </div>
                        <div className="w-full bg-black/50 rounded-sm h-1.5 overflow-hidden">
                            <div 
                                className={`${colors[index % colors.length]} h-full shadow-[0_0_10px_currentColor] relative`} 
                                style={{ width: `${item.progress}%` }}
                            >
                                <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-white opacity-50"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </DashboardWidget>
    )
}

const RecentActivityWidget: React.FC = () => {
    const { news, discussionThreads, getTeamMember } = useData();
    
    const combinedActivity = useMemo(() => {
        const newsActivity = news.map(n => ({
            type: 'NEWS' as const,
            id: n.id,
            title: n.title,
            author: getTeamMember(n.authorId)?.name || 'UNKNOWN',
            date: new Date(n.createdAt),
            link: '/hq/socials', 
        }));
        
        const discussionActivity = discussionThreads.map(t => ({
            type: 'COMM' as const,
            id: t.id,
            title: `Thread: ${t.title}`,
            author: getTeamMember(t.createdBy)?.name || 'UNKNOWN',
            date: new Date(t.createdAt),
            link: '/hq/comms',
        }));
        
        return [...newsActivity, ...discussionActivity]
            .sort((a,b) => b.date.getTime() - a.date.getTime())
            .slice(0, 5);
    }, [news, discussionThreads, getTeamMember]);

    return (
        <DashboardWidget title="Data Stream" icon={<NewspaperIcon className="w-4 h-4"/>} className="lg:col-span-2">
            <ul className="space-y-1">
                {combinedActivity.map(activity => (
                    <li key={`${activity.type}-${activity.id}`}>
                        <Link to={activity.link} className="block p-3 rounded hover:bg-white/5 transition-colors group border-l-2 border-transparent hover:border-brand-accent">
                            <div className="flex justify-between items-center mb-1">
                                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${activity.type === 'NEWS' ? 'border-brand-accent text-brand-accent bg-brand-accent/10' : 'border-egghead-purple text-egghead-purple bg-egghead-purple/10'}`}>
                                    {activity.type}
                                </span>
                                <span className="text-[9px] font-mono text-brand-text-secondary">{activity.date.toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm font-bold text-brand-text truncate group-hover:text-white transition-colors">{activity.title}</p>
                            <p className="text-[10px] text-brand-text-secondary mt-0.5 font-mono uppercase">ID: {activity.author}</p>
                        </Link>
                    </li>
                ))}
                {combinedActivity.length === 0 && <p className="text-xs text-brand-text-secondary text-center py-8 font-mono">NO DATA PACKETS RECEIVED.</p>}
            </ul>
        </DashboardWidget>
    );
};

const BountyLeaderboardWidget: React.FC = () => {
    const { users } = useData();
    
    const sortedUsers = useMemo(() => {
        return [...users].sort((a, b) => (b.bounty || 0) - (a.bounty || 0));
    }, [users]);

    return (
        <DashboardWidget title="Bounty Log" icon={<UsersIcon className="w-4 h-4"/>}>
            <ul className="space-y-2">
                {sortedUsers.slice(0, 5).map((user, index) => (
                    <li key={user.id} className="flex justify-between items-center p-2 rounded bg-brand-dark border border-brand-border relative overflow-hidden group">
                        <div className="flex items-center gap-3 relative z-10">
                            <div className={`w-6 h-6 flex items-center justify-center font-black text-xs rounded ${index === 0 ? 'bg-yellow-500 text-black' : 'bg-brand-border text-brand-text-secondary'}`}>
                                {index + 1}
                            </div>
                            <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded border border-brand-border object-cover bg-black" />
                            <div className="flex flex-col">
                                <span className="font-bold text-xs text-brand-text uppercase">{user.name.split(' ')[0]}</span>
                                <span className="text-[8px] text-brand-text-secondary font-mono tracking-wider">SAT-{index + 1}</span>
                            </div>
                        </div>
                        <div className="relative z-10 text-right">
                            <span className="block font-egghead font-bold text-brand-accent">฿{(user.bounty || 0).toLocaleString()}</span>
                        </div>
                        {/* Hover Glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none"></div>
                    </li>
                ))}
            </ul>
        </DashboardWidget>
    );
};

const DashboardPage: React.FC = () => {
  const { tasks, aeroResults, sponsors } = useData();
  
  const topAero = useMemo(() => {
    if (aeroResults.length === 0) return null;
    return aeroResults.reduce((best, current) => 
        current.liftToDragRatio > best.liftToDragRatio ? current : best
    );
  }, [aeroResults]);

  return (
    <div className="space-y-6 animate-fade-in pb-10">
        <CountdownWidget />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <CompetitionProgressWidget />
            
            <BountyLeaderboardWidget />

            <DashboardWidget title="Aero Telemetry" icon={<WindIcon className="w-4 h-4"/>}>
                {topAero ? (
                     <div className="space-y-3 relative">
                        <div className="absolute inset-0 bg-brand-accent/5 animate-pulse rounded-lg pointer-events-none"></div>
                        <div className="p-2 border border-brand-accent/20 rounded bg-brand-dark/50">
                            <p className="text-[10px] text-brand-text-secondary uppercase mb-1">Top Configuration</p>
                            <p className="font-bold text-sm text-white truncate">{topAero.parameters.carName}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-brand-dark p-2 rounded border border-brand-border text-center">
                                <span className="text-[9px] text-brand-text-secondary uppercase block">Drag (Cd)</span>
                                <span className="font-egghead font-bold text-brand-accent text-lg">{topAero.cd.toFixed(3)}</span>
                            </div>
                            <div className="bg-brand-dark p-2 rounded border border-brand-border text-center">
                                <span className="text-[9px] text-brand-text-secondary uppercase block">Lift (Cl)</span>
                                <span className="font-egghead font-bold text-green-400 text-lg">{topAero.cl.toFixed(3)}</span>
                            </div>
                        </div>
                        <div className="bg-brand-accent/10 p-2 rounded border border-brand-accent/30 flex justify-between items-center">
                            <span className="text-[10px] font-bold text-brand-accent uppercase">Efficiency (L/D)</span>
                            <span className="font-egghead font-black text-xl text-white">{topAero.liftToDragRatio.toFixed(2)}</span>
                        </div>
                     </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                        <WindIcon className="w-12 h-12 mb-2"/>
                        <p className="text-xs font-mono">NO TELEMETRY FOUND</p>
                    </div>
                )}
            </DashboardWidget>

            <DashboardWidget title="Alliance Network" icon={<TrophyIcon className="w-4 h-4"/>}>
                <div className="h-full flex flex-col justify-center items-center py-4">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="64" cy="64" r="60" fill="none" stroke="#1E293B" strokeWidth="8" />
                            <circle 
                                cx="64" cy="64" r="60" 
                                fill="none" stroke="#22C55E" strokeWidth="8" 
                                strokeDasharray="377" 
                                strokeDashoffset={377 - (377 * (sponsors.filter(s => s.status === 'secured').length / Math.max(sponsors.length, 1)))} 
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                            <span className="text-4xl font-black font-egghead text-white">{sponsors.filter(s => s.status === 'secured').length}</span>
                            <span className="text-[9px] font-bold text-brand-text-secondary uppercase tracking-wider">Active</span>
                        </div>
                    </div>
                    <div className="mt-4 flex gap-4 text-xs font-mono">
                        <span className="text-green-400">● SECURED</span>
                        <span className="text-brand-border">● PENDING ({sponsors.filter(s => s.status === 'pending').length})</span>
                    </div>
                </div>
            </DashboardWidget>

            <RecentActivityWidget />

            <DashboardWidget title="Task Matrix" icon={<ClipboardListIcon className="w-4 h-4"/>}>
                <ul className="space-y-2">
                    {tasks.filter(t => t.status !== TaskStatus.Done).slice(0, 4).map(task => (
                        <li key={task.id} className="flex justify-between items-center p-2 rounded border border-brand-border bg-brand-dark/30 hover:border-brand-accent/50 transition-colors">
                            <span className="text-xs font-medium text-brand-text truncate pr-2 flex-grow">{task.title}</span>
                            <span className="font-mono text-[9px] font-bold text-egghead-pink bg-egghead-pink/10 px-1.5 py-0.5 rounded border border-egghead-pink/20">
                                {new Date(task.dueDate).toLocaleDateString(undefined, {month: 'numeric', day: 'numeric'})}
                            </span>
                        </li>
                    ))}
                    {tasks.filter(t => t.status !== TaskStatus.Done).length === 0 && <p className="text-xs text-green-400 text-center py-8 font-mono">ALL SYSTEMS NOMINAL.</p>}
                </ul>
            </DashboardWidget>
        </div>
    </div>
  );
};

export default DashboardPage;