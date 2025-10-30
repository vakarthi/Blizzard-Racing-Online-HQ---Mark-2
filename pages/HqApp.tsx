

import React, { useState, ReactNode, useEffect } from 'react';
import { Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, useAppState } from '../contexts/AppContext';
import { UserRole } from '../types';
import { HomeIcon, WindIcon, ClipboardListIcon, LogOutIcon, MenuIcon, XIcon, AlertTriangleIcon, MessageSquareIcon, MessagesSquareIcon, WrenchIcon, SettingsIcon, CommandIcon, Settings2Icon } from '../components/icons';
import { useCommandK } from '../hooks/useCommandK';
import DashboardPage from './private/DashboardPage';
import AeroPage from './private/AeroPage';
import ProjectsPage from './private/ProjectsPage';
import ManagerPanelPage from './private/ManagerPanelPage';
import SocialsPage from './private/SocialsPage';
import CommunicationsPage from './private/CommunicationsPage';
import Icicle from '../components/hq/IcicleAssistant';
import ToolboxPage from './private/ToolboxPage';
import SettingsPage from './private/SettingsPage';
import CommandPalette from '../components/hq/CommandPalette';

interface NavItem {
  path: string;
  name: string;
  icon: ReactNode;
  roles?: UserRole[];
}

const navItems: NavItem[] = [
  { path: '/', name: 'Dashboard', icon: <HomeIcon className="w-6 h-6" /> },
  { path: '/aero', name: 'Aero Testing', icon: <WindIcon className="w-6 h-6" />, roles: [UserRole.Engineer, UserRole.Designer, UserRole.Manager] },
  { path: '/projects', name: 'Projects', icon: <ClipboardListIcon className="w-6 h-6" /> },
  { path: '/comms', name: 'Comms Hub', icon: <MessagesSquareIcon className="w-6 h-6" /> },
  { path: '/socials', name: 'Socials', icon: <MessageSquareIcon className="w-6 h-6" />, roles: [UserRole.SocialMedia, UserRole.Manager] },
  { path: '/toolbox', name: 'Toolbox', icon: <WrenchIcon className="w-6 h-6" /> },
];

const HqLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { announcement } = useAppState();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isPaletteOpen, setPaletteOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsMac(/Mac/i.test(navigator.platform));
  }, []);

  useCommandK(() => setPaletteOpen(p => !p));

  const filteredNavItems = navItems.filter(item => !item.roles || (user && item.roles.includes(user.role)));

  const SidebarContent = () => (
    <>
    <div className="flex flex-col flex-grow">
      <div className="p-4 flex items-center border-b border-brand-border">
        <div className="bg-brand-dark p-2 rounded-lg mr-3 border border-brand-border">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-accent" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
        </div>
        <h1 className="text-xl font-bold text-brand-text">Blizzard HQ</h1>
      </div>
      <nav className="flex-grow p-4 space-y-2">
        {filteredNavItems.map(item => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive ? 'bg-brand-accent text-brand-dark font-bold shadow-glow-accent' : 'text-brand-text-secondary hover:bg-brand-border hover:text-brand-text'
              }`
            }
            onClick={() => setSidebarOpen(false)}
          >
            {item.icon}
            <span className="ml-4">{item.name}</span>
          </NavLink>
        ))}
        {user?.role === UserRole.Manager && (
            <NavLink
                to="/manager"
                className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive ? 'bg-brand-accent text-brand-dark font-bold shadow-glow-accent' : 'text-brand-text-secondary hover:bg-brand-border hover:text-brand-text'
                }`
                }
                onClick={() => setSidebarOpen(false)}
            >
                <Settings2Icon className="w-6 h-6" />
                <span className="ml-4">Manager Panel</span>
            </NavLink>
        )}
         <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive ? 'bg-brand-accent text-brand-dark font-bold shadow-glow-accent' : 'text-brand-text-secondary hover:bg-brand-border hover:text-brand-text'
              }`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <SettingsIcon className="w-6 h-6" />
            <span className="ml-4">Settings</span>
          </NavLink>
      </nav>
      </div>
      <div className="p-4 border-t border-brand-border">
        <div className="flex items-center mb-4">
          <img src={user?.avatarUrl} alt={user?.name} className="w-12 h-12 rounded-full border-2 border-brand-accent object-cover" />
          <div className="ml-3">
            <p className="font-semibold text-brand-text">{user?.name}</p>
            <p className="text-sm text-brand-text-secondary">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center px-4 py-2 rounded-lg bg-brand-surface text-brand-text-secondary hover:bg-red-600/50 hover:text-brand-text transition-colors"
        >
          <LogOutIcon className="w-5 h-5 mr-2" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-brand-dark">
       {isPaletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} />}
      {/* Mobile Sidebar */}
       <div className={`fixed inset-0 bg-brand-dark-secondary z-40 flex flex-col transition-transform duration-300 ease-in-out md:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <SidebarContent />
       </div>

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-brand-dark-secondary text-brand-text flex-col flex-shrink-0 hidden md:flex border-r border-brand-border">
        <SidebarContent />
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-brand-dark-secondary/80 backdrop-blur-sm shadow-sm p-4 flex items-center justify-between z-10 md:justify-end border-b border-brand-border">
             <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-brand-text">
                {sidebarOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
            <h2 className="text-xl font-bold text-brand-text md:hidden">Blizzard HQ</h2>
            <div className="flex items-center gap-4">
              <button onClick={() => setPaletteOpen(true)} className="flex items-center gap-2 text-sm p-2 rounded-md border border-brand-border bg-brand-dark hover:bg-brand-border transition-colors text-brand-text-secondary">
                <CommandIcon className="w-5 h-5"/>
                <span className="hidden lg:inline">{isMac ? 'Cmd' : 'Ctrl'} + K</span>
              </button>
            </div>
        </header>

        {announcement && (
            <div className="bg-brand-accent/20 border-b-2 border-brand-accent text-brand-accent p-3 text-center text-sm font-semibold flex items-center justify-center animate-fade-in">
                <AlertTriangleIcon className="w-5 h-5 mr-2"/> {announcement}
            </div>
        )}
        
        <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
        </div>
        <Icicle />
      </main>
    </div>
  );
};


const HqApp: React.FC = () => {
    return (
        <HqLayout>
            <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/aero" element={<AeroPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/comms" element={<CommunicationsPage />} />
                <Route path="/socials" element={<SocialsPage />} />
                <Route path="/toolbox" element={<ToolboxPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/manager" element={<ManagerPanelPage />} />
                <Route path="*" element={<div>Not Found</div>} />
            </Routes>
        </HqLayout>
    );
};

export default HqApp;