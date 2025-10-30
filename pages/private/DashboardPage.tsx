
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
            <h3 className="text-lg font-semibold text-brand-accent mb-2">Mission Control: {isPast ? "Competition In Progress" : "Competition Countdown"}</h3>
            <div className="flex justify-center space-x-4 text-4xl font-bold">
                <div>{days}<span className="block text-sm font-normal text-brand-text-secondary">Days</span></div>
                <div>{hours}<span className="block text-sm font-normal text-brand-text-secondary">Hours</span></div>
                <div>{minutes}<span className="block text-sm font-normal text-brand-text-secondary">Minutes</span></div>
                <div>{seconds}<span className="block text-sm font-normal text-brand-text-secondary">Seconds</span></div>
            </div>
        </div>
    );
};

const CompetitionProgressWidget: React.FC = () => {
    const { competitionProgress } = useData();
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500'];

    return (
        <DashboardWidget title="Competition Progress" icon={<TrophyIcon />} className="lg:col-span-2">
            <div className="space-y-4">
                {competitionProgress.map((item, index) => (
                    <div key={item.category}>
                        <div className="flex justify-between items-baseline mb-1">
                            <span className="text-sm font-semibold text-brand-text">{item.category}</span>
                            <span className="text-sm font-bold text-brand-text-secondary">{item.progress}%</span>
                        </div>
                        <div className="w-full bg-brand-dark rounded-full h-2.5">
                            <div className={`${colors[index % colors.length]} h-2.5 rounded-full`} style={{ width: `${item.progress}%` }}></div>
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
            link: '/socials', // This should ideally link to a specific post
        }));
        
        const discussionActivity = discussionThreads.map(t => ({
            type: 'discussion' as const,
            id: t.id,
            title: `New thread: ${t.title}`,
            author: getTeamMember(t.createdBy)?.name || 'Team',
            date: new Date(t.createdAt),
            link: '/comms',
        }));
        
        return [...newsActivity, ...discussionActivity]
            .sort((a,b) => b.date.getTime() - a.date.getTime())
            .slice(0, 4);
    }, [news, discussionThreads, getTeamMember]);

    return (
        <DashboardWidget title="Recent Activity" icon={<NewspaperIcon />} className="lg:col-span-2">
            <ul className="space-y-3">
                {combinedActivity.map(activity => (
                    <li key={`${activity.type}-${activity.id}`}>
                        <Link to={activity.link} className="block p-3 rounded-lg bg-brand-dark hover:bg-brand-border transition-colors">
                            <div className="flex justify-between items-center text-sm">
                                <p className="font-semibold text-brand-text truncate pr-4">{activity.title}</p>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${activity.type === 'news' ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'}`}>{activity.type}</span>
                            </div>
                            <p className="text-xs text-brand-text-secondary mt-1">{activity.author} &bull; {activity.date.toLocaleDateString()}</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </DashboardWidget>
    );
};

const TeamOverviewWidget: React.FC = () => {
    const { users } = useData();
    const roleCounts = useMemo(() => {
        return users.reduce((acc, user) => {
            acc[user.role] = (acc[user.role] || 0) + 1;
            return acc;
        }, {} as Record<UserRole, number>);
    }, [users]);

    return (
        <DashboardWidget title="Team Overview" icon={<UsersIcon />}>
            <ul className="space-y-2">
                {Object.entries(roleCounts).map(([role, count]) => (
                    <li key={role} className="flex justify-between items-center text-sm p-2 bg-brand-dark rounded">
                        <span className="font-semibold text-brand-text-secondary">{role}</span>
                        <span className="font-bold text-brand-text text-lg">{count}</span>
                    </li>
                ))}
            </ul>
        </DashboardWidget>
    )
}

const DashboardPage: React.FC = () => {
  const { tasks, aeroResults, sponsors } = useData();
  const topAero = aeroResults.find(r => r.isBest);

  return (
    <div className="space-y-6 animate-fade-in">
        <CountdownWidget />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <CompetitionProgressWidget />
            
            <DashboardWidget title="Top Aero Design" icon={<WindIcon />}>
                {topAero ? (
                     <div className="space-y-2">
                        <p className="font-semibold text-brand-accent">{topAero.parameters.carName}</p>
                        <div className="flex justify-between text-sm bg-brand-dark p-2 rounded">
                            <span>Drag (Cd):</span> <span className="font-bold">{topAero.cd}</span>
                        </div>
                        <div className="flex justify-between text-sm bg-brand-dark p-2 rounded">
                            <span>Lift (Cl):</span> <span className="font-bold text-green-400">{topAero.cl}</span>
                        </div>
                        <div className="flex justify-between text-sm bg-brand-dark p-2 rounded">
                            <span>L/D Ratio:</span> <span className="font-bold text-green-400">{topAero.liftToDragRatio}</span>
                        </div>
                     </div>
                ) : (
                    <p className="text-brand-text-secondary">No simulations run yet.</p>
                )}
            </DashboardWidget>

            <DashboardWidget title="Sponsorship" icon={<TrophyIcon />}>
                <div className="text-center">
                    <p className="text-4xl font-bold text-green-400">{sponsors.filter(s => s.status === 'secured').length}</p>
                    <p className="text-brand-text-secondary">Secured Partners</p>
                    <p className="text-lg font-semibold text-yellow-400 mt-2">{sponsors.filter(s => s.status === 'pending').length} pending</p>
                </div>
            </DashboardWidget>

            <RecentActivityWidget />

            <TeamOverviewWidget />

            <DashboardWidget title="Project Deadlines" icon={<ClipboardListIcon />}>
                <ul className="space-y-3">
                    {tasks.filter(t => t.status !== TaskStatus.Done).slice(0, 4).map(task => (
                        <li key={task.id} className="flex justify-between items-center text-sm">
                            <span className="text-brand-text-secondary truncate pr-2">{task.title}</span>
                            <span className="font-semibold text-brand-text flex-shrink-0">{new Date(task.dueDate).toLocaleDateString()}</span>
                        </li>
                    ))}
                </ul>
            </DashboardWidget>
        </div>
    </div>
  );
};

export default DashboardPage;