
import React, { useState, ReactNode, useEffect } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { useAuth, useAppState, useData } from '../contexts/AppContext';
import { UserRole, SyncStatus } from '../types';
import { HomeIcon, WindIcon, ClipboardListIcon, LogOutIcon, MenuIcon, XIcon, AlertTriangleIcon, MessageSquareIcon, MessagesSquareIcon, WrenchIcon, SettingsIcon, CommandIcon, Settings2Icon, EditIcon, AnchorIcon, BotIcon, GraduationCapIcon, SkullIcon, LayersIcon } from '../components/icons';
import { useCommandK } from '../hooks/useCommandK';
import useInactivityTimeout from '../hooks/useInactivityTimeout';
import DashboardPage from './private/DashboardPage';
import AeroPage from './private/AeroPage';
import ProjectsPage from './private/ProjectsPage';
import ManagerPanelGate from './private/ManagerPanelGate';
import SocialsPage from './private/SocialsPage';
import CommunicationsPage from './private/CommunicationsPage';
import Icicle from '../components/hq/IcicleAssistant';
import ToolboxPage from './private/ToolboxPage';
import SettingsPage from './private/SettingsPage';
import CommandPalette from '../components/hq/CommandPalette';
import PortalEditorPage from './private/PortalEditorPage';
import LeadsPage from './private/LeadsPage';
import AeroEducationPage from './private/AeroEducationPage';
import NotificationManager from '../components/hq/NotificationManager';

interface NavItem {
  path: string;
  name: string;
  icon: ReactNode;
  roles?: UserRole[];
}

// Egghead Terminology Map
const navItems: NavItem[] = [
  { path: '', name: 'Control Deck', icon: <HomeIcon className="w-5 h-5" /> },
  { path: 'aero', name: 'Flow Engine', icon: <WindIcon className="w-5 h-5" />, roles: [UserRole.DesignEngineer, UserRole.Manager, UserRole.ManufacturingEngineer] },
  { path: 'aero-academy', name: 'Ohara Library', icon: <GraduationCapIcon className="w-5 h-5" /> },
  { path: 'projects', name: 'Research Logs', icon: <ClipboardListIcon className="w-5 h-5" /> },
  { path: 'comms', name: 'Den Den Mushi', icon: <MessagesSquareIcon className="w-5 h-5" /> },
  { path: 'socials', name: 'News Coo', icon: <MessageSquareIcon className="w-5 h-5" />, roles: [UserRole.Manager, UserRole.SocialsDesigner, UserRole.Marketing] },
  { path: 'leads', name: 'Bounty Board', icon: <SkullIcon className="w-5 h-5" />, roles: [UserRole.Manager, UserRole.Marketing] },
  { path: 'toolbox', name: 'Franky House', icon: <WrenchIcon className="w-5 h-5" /> },
  { path: 'portal-editor', name: 'World Gov Portal', icon: <EditIcon className="w-5 h-5" />, roles: [UserRole.Manager, UserRole.GraphicDesigner, UserRole.SocialsDesigner] },
];

const HqLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { announcement, teamLogoUrl, syncStatus } = useAppState();
  const { punkRecords } = useData();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isPaletteOpen, setPaletteOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);

  useInactivityTimeout(logout);

  useEffect(() => {
    setIsMac(/Mac/i.test(navigator.platform));
  }, []);

  useCommandK(() => setPaletteOpen(p => !p));

  const filteredNavItems = navItems.filter(item => !item.roles || (user && item.roles.includes(user.role)));

  const statusColors: Record<string, string> = {
      OFFLINE: 'bg-gray-600',
      CONNECTING: 'bg-yellow-500 animate-pulse',
      SYNCED: 'bg-brand-accent shadow-[0_0_10px_#00F0FF]',
      HUB_ACTIVE: 'bg-egghead-purple shadow-[0_0_10px_#BD00FF] animate-pulse',
      SEARCHING: 'bg-egghead-pink animate-pulse shadow-[0_0_10px_#FF0055]',
      ERROR: 'bg-red-600',
      CONFLICT: 'bg-orange-500',
  };

  const SidebarContent = () => (
    <>
    <div className="flex flex-col flex-grow relative overflow-hidden">
      {/* Sidebar Tech Background */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:20px_20px]"></div>
      
      <div className="p-6 flex flex-col gap-4 border-b border-brand-border bg-black/20 backdrop-blur-sm">
        <div className="flex items-center gap-3">
            <div className="relative group">
                <div className="absolute inset-0 bg-brand-accent rounded-full blur opacity-20 group-hover:opacity-50 transition-opacity"></div>
                <img src={teamLogoUrl} alt="Logo" className="h-10 w-10 object-contain relative z-10 p-1 bg-brand-dark rounded-full border border-brand-accent/50" />
            </div>
            <div>
                <h1 className="text-xl font-black font-display text-white tracking-widest italic">EGGHEAD</h1>
                <p className="text-[9px] font-egghead text-brand-accent tracking-[0.3em] uppercase">Future Island</p>
            </div>
        </div>
        {/* Punk Records Status Mini-Widget */}
        <div className="bg-brand-dark/50 border border-brand-border rounded p-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${statusColors[syncStatus as string]}`}></div>
                <span className="text-[10px] font-egghead text-brand-text-secondary uppercase">PUNK RECORDS</span>
            </div>
            <span className="text-[10px] font-mono text-brand-accent">{punkRecords?.generationName}</span>
        </div>
      </div>

      <nav className="flex-grow px-3 py-4 space-y-1 overflow-y-auto">
        {filteredNavItems.map(item => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === ''}
            className={({ isActive }) =>
              `group flex items-center px-4 py-3 rounded-md transition-all duration-300 relative overflow-hidden ${
                isActive 
                ? 'text-brand-dark font-bold' 
                : 'text-brand-text-secondary hover:text-brand-accent'
              }`
            }
            onClick={() => setSidebarOpen(false)}
          >
            {({ isActive }) => (
                <>
                    {/* Active Background Glitch */}
                    {isActive && (
                        <div className="absolute inset-0 bg-brand-accent">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-multiply"></div>
                        </div>
                    )}
                    {/* Hover Line */}
                    {!isActive && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-brand-accent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>}
                    
                    <span className="relative z-10 flex items-center">
                        {item.icon}
                        <span className="ml-3 font-display tracking-wide text-xs uppercase">{item.name}</span>
                    </span>
                </>
            )}
          </NavLink>
        ))}

        <div className="pt-4 mt-4 border-t border-brand-border/50 px-2">
            <p className="px-2 text-[9px] font-egghead text-brand-text-secondary uppercase tracking-widest opacity-50 mb-2">System Admin</p>
            {user?.role === UserRole.Manager && (
                <NavLink
                    to="manager"
                    className={({ isActive }) =>
                    `flex items-center px-4 py-2 rounded-md text-xs font-bold transition-all ${
                        isActive ? 'text-egghead-pink bg-egghead-pink/10 border border-egghead-pink/30' : 'text-brand-text-secondary hover:text-egghead-pink'
                    }`
                    }
                    onClick={() => setSidebarOpen(false)}
                >
                    <Settings2Icon className="w-4 h-4 mr-3" />
                    GOROSEI PANEL
                </NavLink>
            )}
             <NavLink
                to="settings"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded-md text-xs font-bold transition-all ${
                    isActive ? 'text-white bg-white/10' : 'text-brand-text-secondary hover:text-white'
                  }`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <SettingsIcon className="w-4 h-4 mr-3" />
                CONFIG
              </NavLink>
        </div>
      </nav>
      </div>

      <div className="p-4 border-t border-brand-border bg-black/20">
        <div className="flex items-center mb-4">
          <div className="relative">
             <img src={user?.avatarUrl} alt={user?.name} className="w-10 h-10 rounded-sm border border-brand-accent/50 p-0.5" />
             <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-brand-dark border border-brand-border flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
             </div>
          </div>
          <div className="ml-3 overflow-hidden">
            <p className="font-bold text-sm text-brand-text truncate font-display">{user?.name}</p>
            <p className="text-[10px] text-brand-text-secondary uppercase font-egghead tracking-wider">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center px-4 py-2 rounded text-xs font-bold uppercase tracking-wider border border-red-900/50 text-red-500 hover:bg-red-500 hover:text-white transition-all group"
        >
          <LogOutIcon className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform" />
          Disconnect
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-brand-dark font-sans text-brand-text overflow-hidden relative selection:bg-brand-accent selection:text-brand-dark">
       {/* Global Background Elements */}
       <div className="fixed inset-0 labophase-grid opacity-30 pointer-events-none z-0"></div>
       <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-accent to-transparent opacity-50 z-50"></div>

       {isPaletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} />}
       
       {/* Mobile Sidebar */}
       <div className={`fixed inset-0 bg-black/80 backdrop-blur-md z-40 transition-opacity duration-300 md:hidden ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setSidebarOpen(false)}></div>
       <div className={`fixed inset-y-0 left-0 w-64 bg-[#0B1121] border-r border-brand-border z-50 flex flex-col transition-transform duration-300 ease-out md:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <SidebarContent />
       </div>

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-[#0B1121]/80 backdrop-blur-xl flex-col flex-shrink-0 hidden md:flex border-r border-brand-border/50 relative z-20">
        <SidebarContent />
      </aside>

      <main className="flex-1 flex flex-col relative z-10 min-w-0">
        <header className="h-16 flex items-center justify-between px-6 border-b border-brand-border/50 bg-[#0B1121]/50 backdrop-blur-md sticky top-0 z-20">
             <div className="flex items-center gap-4">
                 <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-brand-text hover:text-brand-accent transition-colors">
                    {sidebarOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                </button>
                {/* Breadcrumbs / Page Title */}
                <div className="hidden md:flex items-center text-sm font-egghead text-brand-text-secondary">
                    <span>HQ</span>
                    <span className="mx-2 text-brand-accent">/</span>
                    <span className="text-white tracking-wider uppercase">LABOPHASE</span>
                </div>
             </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setPaletteOpen(true)} 
                className="group flex items-center gap-3 px-3 py-1.5 rounded border border-brand-border bg-black/40 hover:border-brand-accent/50 transition-all text-xs text-brand-text-secondary hover:text-brand-text"
              >
                <span className="flex items-center gap-2">
                    <CommandIcon className="w-3 h-3 group-hover:text-brand-accent transition-colors"/>
                    <span className="hidden sm:inline">Search Database...</span>
                </span>
                <kbd className="hidden lg:inline-flex items-center gap-1 font-mono bg-white/5 px-1.5 py-0.5 rounded border border-white/10 text-[10px] text-brand-text-secondary">
                    {isMac ? '⌘' : 'Ctrl'} K
                </kbd>
              </button>
            </div>
        </header>

        {announcement && (
            <div className="bg-brand-accent/10 border-b border-brand-accent/30 backdrop-blur-md text-brand-accent px-4 py-2 text-center text-xs font-bold font-egghead tracking-widest flex items-center justify-center animate-fade-in relative z-10">
                <AlertTriangleIcon className="w-4 h-4 mr-2 animate-pulse"/> 
                <span>SYSTEM ALERT: {announcement}</span>
            </div>
        )}
        
        <div className="flex-1 overflow-x-hidden overflow-y-auto scroll-smooth">
            <div className="p-4 md:p-8 pb-24 max-w-7xl mx-auto">
                {children}
            </div>
        </div>
        <Icicle />
      </main>
      <NotificationManager />
    </div>
  );
};

const HqApp: React.FC = () => {
    const { user } = useAuth();
    return (
        <HqLayout>
            <Routes>
                <Route index element={<DashboardPage />} />
                <Route path="aero" element={<AeroPage />} />
                <Route path="aero-academy" element={<AeroEducationPage />} />
                <Route path="projects" element={<ProjectsPage />} />
                <Route path="comms" element={<CommunicationsPage />} />
                <Route path="socials" element={<SocialsPage />} />
                <Route path="leads" element={<LeadsPage />} />
                <Route path="toolbox" element={<ToolboxPage />} />
                <Route path="portal-editor" element={<PortalEditorPage />} />
                <Route path="settings" element={<SettingsPage />} />
                {user?.role === UserRole.Manager && <Route path="manager" element={<ManagerPanelGate />} />}
                <Route path="*" element={<div>Not Found</div>} />
            </Routes>
        </HqLayout>
    );
};

export default HqApp;
