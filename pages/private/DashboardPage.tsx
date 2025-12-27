
import React, { useEffect, useState, useMemo } from 'react';
import { useData, useAppState } from '../../contexts/AppContext';
import DashboardWidget from '../../components/hq/DashboardWidget';
import { ClipboardListIcon, TrophyIcon, UsersIcon, WindIcon, NewspaperIcon } from '../../components/icons';
import { Task, TaskStatus, UserRole } from '../../types';
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
             <div className="text-center p-6 bg-brand-dark-secondary rounded-xl text-brand-text shadow-lg border border-brand-border">
                <h3 className="text-lg font-semibold text-yellow-400 mb-2">Competition date not set.</h3>
                <p className="text-brand-text-secondary">A manager needs to set the competition date in the Manager Panel.</p>
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
        <div className="text-center p-6 bg-brand-dark-secondary rounded-xl text-brand-text shadow-lg border border-brand-border">
            <h3 className="text-lg font-semibold text-brand-accent mb-4">Mission Control: {isPast ? "Competition In Progress" : "Competition Countdown"}</h3>
            <div className="flex justify-center gap-4 md:gap-8">
                <div className="flex flex-col items-center">
                    <span className="text-2xl md:text-4xl font-bold">{days}</span>
                    <span className="text-[10px] md:text-xs text-brand-text-secondary uppercase tracking-wider">Days</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-2xl md:text-4xl font-bold">{hours}</span>
                    <span className="text-[10px] md:text-xs text-brand-text-secondary uppercase tracking-wider">Hours</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-2xl md:text-4xl font-bold">{minutes}</span>
                    <span className="text-[10px] md:text-xs text-brand-text-secondary uppercase tracking-wider">Mins</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-2xl md:text-4xl font-bold">{seconds}</span>
                    <span className="text-[10px] md:text-xs text-brand-text-secondary uppercase tracking-wider">Secs</span>
                </div>
            </div>
        </div>
    );
};

const CompetitionProgressWidget: React.FC = () => {
    const { competitionProgress } = useData();
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500'];

    return (
        <DashboardWidget title="Competition Progress" icon={<TrophyIcon className="w-5 h-5"/>} className="lg:col-span-2">
            <div className="space-y-4">
                {competitionProgress.map((item, index) => (
                    <div key={item.category}>
                        <div className="flex justify-between items-baseline mb-1">
                            <span className="text-xs md:text-sm font-semibold text-brand-text truncate pr-2">{item.category}</span>
                            <span className="text-xs md:text-sm font-bold text-brand-text-secondary">{item.progress}%</span>
                        </div>
                        <div className="w-full bg-brand-dark rounded-full h-2">
                            <div className={`${colors[index % colors.length]} h-2 rounded-full`} style={{ width: `${item.progress}%` }}></div>
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
            type: 'news' as const,
            id: n.id,
            title: n.title,
            author: getTeamMember(n.authorId)?.name || 'Team',
            date: new Date(n.createdAt),
            link: '/hq/socials', 
        }));
        
        const discussionActivity = discussionThreads.map(t => ({
            type: 'discussion' as const,
            id: t.id,
            title: `New thread: ${t.title}`,
            author: getTeamMember(t.createdBy)?.name || 'Team',
            date: new Date(t.createdAt),
            link: '/hq/comms',
        }));
        
        return [...newsActivity, ...discussionActivity]
            .sort((a,b) => b.date.getTime() - a.date.getTime())
            .slice(0, 4);
    }, [news, discussionThreads, getTeamMember]);

    return (
        <DashboardWidget title="Recent Activity" icon={<NewspaperIcon className="w-5 h-5"/>} className="lg:col-span-2">
            <ul className="space-y-3">
                {combinedActivity.map(activity => (
                    <li key={`${activity.type}-${activity.id}`}>
                        <Link to={activity.link} className="block p-3 rounded-lg bg-brand-dark hover:bg-brand-border transition-colors">
                            <div className="flex justify-between items-start md:items-center text-sm gap-2">
                                <p className="font-semibold text-brand-text truncate flex-grow">{activity.title}</p>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${activity.type === 'news' ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'}`}>{activity.type}</span>
                            </div>
                            <p className="text-[10px] md:text-xs text-brand-text-secondary mt-1">{activity.author} &bull; {activity.date.toLocaleDateString()}</p>
                        </Link>
                    </li>
                ))}
                {combinedActivity.length === 0 && <p className="text-sm text-brand-text-secondary text-center py-4">No recent activity.</p>}
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
        <DashboardWidget title="Active Bounties" icon={<UsersIcon className="w-5 h-5"/>}>
            <ul className="space-y-2">
                {sortedUsers.map((user, index) => (
                    <li key={user.id} className="flex justify-between items-center text-sm p-3 bg-brand-dark rounded-lg border border-brand-border hover:border-[#3e2723]/50 transition-colors">
                        <div className="flex items-center gap-3">
                            <span className={`font-mono text-xs w-4 ${index === 0 ? 'text-yellow-400 font-bold' : 'text-brand-text-secondary'}`}>{index + 1}.</span>
                            <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-brand-border" />
                            <div className="flex flex-col">
                                <span className="font-bold text-brand-text leading-none">{user.name}</span>
                                <span className="text-[10px] text-brand-text-secondary uppercase tracking-wider">{user.role}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className={`font-mono font-bold ${index === 0 ? 'text-yellow-400' : 'text-brand-text'}`}>{(user.bounty || 0).toLocaleString()}</span>
                            <span className="text-[9px] text-brand-text-secondary uppercase">Value</span>
                        </div>
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

            <DashboardWidget title="Top Aero Design" icon={<WindIcon className="w-5 h-5"/>}>
                {topAero ? (
                     <div className="space-y-2">
                        <p className="font-semibold text-brand-accent truncate">{topAero.parameters.carName}</p>
                        <div className="flex justify-between text-sm bg-brand-dark p-2 rounded">
                            <span className="text-brand-text-secondary">Drag (Cd):</span> <span className="font-bold">{topAero.cd}</span>
                        </div>
                        <div className="flex justify-between text-sm bg-brand-dark p-2 rounded">
                            <span className="text-brand-text-secondary">Lift (Cl):</span> <span className="font-bold text-green-400">{topAero.cl}</span>
                        </div>
                        <div className="flex justify-between text-sm bg-brand-dark p-2 rounded">
                            <span className="text-brand-text-secondary">L/D Ratio:</span> <span className="font-bold text-green-400">{topAero.liftToDragRatio}</span>
                        </div>
                     </div>
                ) : (
                    <p className="text-brand-text-secondary text-sm">No simulations run yet.</p>
                )}
            </DashboardWidget>

            <DashboardWidget title="Sponsorship" icon={<TrophyIcon className="w-5 h-5"/>}>
                <div className="text-center py-2">
                    <p className="text-4xl font-bold text-green-400">{sponsors.filter(s => s.status === 'secured').length}</p>
                    <p className="text-brand-text-secondary text-xs uppercase tracking-wider">Secured Partners</p>
                    <p className="text-sm font-semibold text-yellow-400 mt-2">{sponsors.filter(s => s.status === 'pending').length} pending</p>
                </div>
            </DashboardWidget>

            <RecentActivityWidget />

            <DashboardWidget title="Project Deadlines" icon={<ClipboardListIcon className="w-5 h-5"/>}>
                <ul className="space-y-3">
                    {tasks.filter(t => t.status !== TaskStatus.Done).slice(0, 4).map(task => (
                        <li key={task.id} className="flex justify-between items-center text-sm">
                            <span className="text-brand-text-secondary truncate pr-2 flex-grow">{task.title}</span>
                            <span className="font-semibold text-brand-text flex-shrink-0 text-xs">{new Date(task.dueDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                        </li>
                    ))}
                    {tasks.filter(t => t.status !== TaskStatus.Done).length === 0 && <p className="text-sm text-brand-text-secondary text-center">No pending deadlines.</p>}
                </ul>
            </DashboardWidget>
        </div>
    </div>
  );
};

export default DashboardPage;
