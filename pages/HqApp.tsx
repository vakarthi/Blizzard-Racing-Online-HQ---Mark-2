
import React, { useState, ReactNode, useEffect } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { useAuth, useAppState, useData } from '../contexts/AppContext';
import { UserRole } from '../types';
import { HomeIcon, WindIcon, ClipboardListIcon, LogOutIcon, MenuIcon, XIcon, AlertTriangleIcon, MessageSquareIcon, MessagesSquareIcon, WrenchIcon, SettingsIcon, CommandIcon, Settings2Icon, EditIcon, BriefcaseIcon, GraduationCapIcon, SparklesIcon, CalculatorIcon, SkullIcon, AnchorIcon, BotIcon } from '../components/icons';
import { useCommandK } from '../hooks/useCommandK';
import { useKonamiCode } from '../hooks/useKonamiCode';
import useInactivityTimeout from '../hooks/useInactivityTimeout';
import DashboardPage from './private/DashboardPage';
import AeroPage from './private/AeroPage';
import AeroEducationPage from './private/AeroEducationPage';
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
import NotificationManager from '../components/hq/NotificationManager';
import { useTheme } from '../contexts/ThemeContext';

interface NavItem {
  path: string;
  name: string;
  icon: ReactNode;
  roles?: UserRole[];
}

const navItems: NavItem[] = [
  { path: '', name: 'The Bridge', icon: <AnchorIcon className="w-5 h-5" /> },
  { path: 'aero', name: 'Egghead Lab', icon: <WindIcon className="w-5 h-5" />, roles: [UserRole.Manager, UserRole.DesignEngineer, UserRole.ManufacturingEngineer] },
  { path: 'aero-academy', name: 'Ohara Library', icon: <GraduationCapIcon className="w-5 h-5" />, roles: [UserRole.Manager, UserRole.DesignEngineer, UserRole.ManufacturingEngineer] },
  { path: 'projects', name: 'Shipwright Dock', icon: <ClipboardListIcon className="w-5 h-5" /> },
  { path: 'comms', name: 'Den Den Mushi', icon: <MessagesSquareIcon className="w-5 h-5" /> },
  { path: 'leads', name: 'Bounty Board', icon: <SkullIcon className="w-5 h-5" />, roles: [UserRole.Manager, UserRole.Marketing] },
  { path: 'socials', name: 'News Coo', icon: <MessageSquareIcon className="w-5 h-5" />, roles: [UserRole.Manager, UserRole.SocialsDesigner, UserRole.Marketing] },
  { path: 'toolbox', name: 'Franky\'s Workshop', icon: <WrenchIcon className="w-5 h-5" />, roles: [UserRole.Manager, UserRole.ManufacturingEngineer, UserRole.DesignEngineer] },
  { path: 'portal-editor', name: 'World Gov. Portal', icon: <EditIcon className="w-5 h-5" />, roles: [UserRole.Manager, UserRole.SocialsDesigner, UserRole.GraphicDesigner, UserRole.Marketing] },
];

const SupercomputerHUD = () => (
    <div className="fixed inset-0 pointer-events-none z-[999] overflow-hidden font-manga text-brand-accent select-none">
        {/* Top Left - Nika Pulse */}
        <div className="absolute top-6 left-6 flex flex-col gap-1">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-brand-accent rounded-full animate-ping"></div>
                <span className="text-2xl font-black tracking-widest text-brand-text">GEAR 5: ACTIVE</span>
            </div>
            <div className="text-sm font-sans font-bold text-brand-text-secondary animate-pulse ml-6">DRUMS OF LIBERATION SYNCED</div>
        </div>

        {/* Top Right - Haki Voltage */}
        <div className="absolute top-6 right-6 text-right">
            <div className="border-4 border-brand-accent px-4 py-2 bg-white/80 backdrop-blur-sm shadow-[5px_5px_0px_rgba(0,0,0,0.2)] transform -rotate-2">
                <span className="text-xl font-black text-brand-text">CONQUEROR'S HAKI</span>
            </div>
            <div className="mt-2 font-mono text-xs text-brand-text-secondary bg-white/50 inline-block px-2">OVERRIDE: 100%</div>
        </div>

        {/* Bottom Left - Egghead Data */}
        <div className="absolute bottom-6 left-6 flex flex-col gap-2">
             <div className="flex items-center gap-2">
                <BotIcon className="w-6 h-6 animate-bounce" />
                <span className="font-bold">VEGAFORCE-01 CONNECTION: STABLE</span>
             </div>
             <div className="text-xs font-mono text-brand-text-secondary">PUNK RECORDS UPLOAD...</div>
        </div>

        {/* Floating Clouds (CSS Animation) */}
        <div className="absolute top-1/4 left-1/4 text-6xl opacity-10 animate-float-cloud text-brand-accent">☁</div>
        <div className="absolute top-3/4 right-1/4 text-8xl opacity-10 animate-float-cloud [animation-delay:2s] text-brand-accent">☁</div>
        <div className="absolute top-1/2 left-3/4 text-4xl opacity-10 animate-float-cloud [animation-delay:4s] text-brand-accent">☁</div>

        {/* Center Overlay - subtle pulse */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(147,51,234,0.05)_100%)] animate-liberation pointer-events-none"></div>
    </div>
);

const HqLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { announcement, teamLogoUrl, syncStatus } = useAppState();
  const { punkRecords } = useData();
  const { gear5Mode } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isPaletteOpen, setPaletteOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);

  // Bedtime Protocol: Check for 10 PM logout only
  useInactivityTimeout(logout);

  useEffect(() => {
    setIsMac(/Mac/i.test(navigator.platform));
  }, []);

  useCommandK(() => setPaletteOpen(p => !p));
  
  const filteredNavItems = navItems.filter(item => !item.roles || (user && item.roles.includes(user.role)));
  
  const statusColors: Record<typeof syncStatus, string> = {
      OFFLINE: 'bg-gray-500',
      CONNECTING: 'bg-yellow-500 animate-pulse',
      SYNCED: 'bg-green-500',
      ERROR: 'bg-red-500 animate-pulse',
      CONFLICT: 'bg-orange-500 animate-pulse',
  };

  const SidebarContent = () => (
    <>
    <div className="flex flex-col flex-grow">
      <div className="p-6 flex items-center mb-2">
        <div className="bg-gradient-to-br from-brand-surface to-brand-dark-secondary p-2 rounded-xl mr-3 border border-brand-border/50 shadow-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-brand-accent/20 animate-pulse hidden group-hover:block"></div>
            <img src={teamLogoUrl} alt="Blizzard Racing Logo" className="h-8 w-8 object-contain relative z-10" />
        </div>
        <div>
            <h1 className={`text-xl font-bold text-brand-text tracking-tight ${gear5Mode ? 'font-manga' : 'font-display'}`}>
                {gear5Mode ? 'SUN GOD NIKA' : 'BLZ x EGGHEAD'}
            </h1>
            <p className="text-[10px] text-brand-text-secondary font-mono tracking-widest uppercase">
                {gear5Mode ? 'WARRIOR OF LIBERATION' : 'Future Island Ops'}
            </p>
        </div>
      </div>
      <nav className="flex-grow px-3 space-y-1 overflow-y-auto">
        {filteredNavItems.map(item => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === ''}
            className={({ isActive }) =>
              `flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive 
                ? 'bg-brand-accent/10 text-brand-accent border border-brand-accent/20 shadow-[0_0_15px_-5px_var(--color-accent-default)]' 
                : 'text-brand-text-secondary hover:bg-white/5 hover:text-brand-text border border-transparent'
              }`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <span className={`transition-transform duration-200 ${item.path === '' ? '' : 'group-hover:scale-110'}`}>{item.icon}</span>
            <span className="ml-3 font-bold">{item.name}</span>
          </NavLink>
        ))}
        
        <div className="pt-4 mt-4 border-t border-brand-border/50">
            <p className="px-4 text-[10px] font-bold text-brand-text-secondary uppercase tracking-wider mb-2">System</p>
            {user?.role === UserRole.Manager && (
                <NavLink
                    to="manager"
                    className={({ isActive }) =>
                    `flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive ? 'bg-brand-accent/10 text-brand-accent border border-brand-accent/20' : 'text-brand-text-secondary hover:bg-white/5 hover:text-brand-text border border-transparent'
                    }`
                    }
                    onClick={() => setSidebarOpen(false)}
                >
                    <Settings2Icon className="w-5 h-5" />
                    <span className="ml-3">Gorosei Panel</span>
                </NavLink>
            )}
             <NavLink
                to="settings"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive ? 'bg-brand-accent/10 text-brand-accent border border-brand-accent/20' : 'text-brand-text-secondary hover:bg-white/5 hover:text-brand-text border border-transparent'
                  }`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <SettingsIcon className="w-5 h-5" />
                <span className="ml-3">Settings</span>
              </NavLink>
        </div>
      </nav>
      </div>
      <div className="p-4 m-3 rounded-xl bg-gradient-to-b from-white/5 to-transparent border border-white/5 backdrop-blur-sm">
        <div className="flex items-center mb-3">
          <div className="relative">
             <img src={user?.avatarUrl} alt={user?.name} className="w-10 h-10 rounded-full border border-brand-border object-cover" />
             {gear5Mode && <div className="absolute -top-2 -right-2 text-xs">☁️</div>}
          </div>
          <div className="ml-3 overflow-hidden">
            <p className="font-semibold text-sm text-brand-text truncate">{user?.name}</p>
            <p className="text-[10px] text-brand-text-secondary uppercase tracking-wider truncate flex items-center gap-1">
                <span className="text-yellow-500 font-bold">฿</span> {(user?.bounty || 0).toLocaleString()}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center px-3 py-2 rounded-lg text-xs font-medium bg-white/5 text-brand-text-secondary hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 border border-transparent transition-all"
        >
          <LogOutIcon className="w-4 h-4 mr-2" />
          Abandon Ship
        </button>
      </div>
    </>
  );

  return (
    <div className={`flex h-screen bg-brand-dark overflow-hidden ${gear5Mode ? 'animate-liberation' : ''}`}>
       {isPaletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} />}
       
       {gear5Mode && <SupercomputerHUD />}
      
      {/* Mobile Sidebar Overlay */}
       <div className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setSidebarOpen(false)}></div>
       
       <div className={`fixed inset-y-0 left-0 w-64 bg-brand-dark-secondary/95 backdrop-blur-xl z-50 flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden border-r border-brand-border/50 shadow-2xl ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <SidebarContent />
       </div>

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-brand-dark-secondary/60 backdrop-blur-xl flex-col flex-shrink-0 hidden md:flex border-r border-brand-border/50 z-20">
        <SidebarContent />
      </aside>

      <main className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-16 flex items-center justify-between px-4 md:px-6 z-10 border-b border-brand-border/50 bg-brand-dark-secondary/40 backdrop-blur-md sticky top-0">
             <div className="flex items-center">
                 <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-brand-text mr-4 p-2 -ml-2 rounded-md hover:bg-white/5">
                    {sidebarOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                </button>
                {/* PUNK RECORDS STATUS BAR */}
                <div className="hidden md:flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${statusColors[syncStatus]}`}></div>
                        <span className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest font-egghead">
                            PUNK RECORDS: {syncStatus}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-brand-accent uppercase tracking-widest font-egghead flex items-center gap-1">
                                <SparklesIcon className="w-3 h-3 animate-pulse" />
                                {punkRecords?.generationName || 'SATURN'} 
                                <span className="opacity-50"> // GEN-{punkRecords?.solverGeneration.toString().padStart(2, '0')}</span>
                            </span>
                        </div>
                        <div className="w-32 h-1 bg-brand-border/50 rounded-full mt-1 overflow-hidden">
                            <div 
                                className="h-full bg-brand-accent shadow-[0_0_10px_var(--color-accent-default)] transition-all duration-1000 ease-linear"
                                style={{ width: `${punkRecords?.syncRate}%` }}
                            ></div>
                        </div>
                    </div>
                    {gear5Mode && <div className="text-[10px] font-mono text-purple-400 animate-bounce">NI-KA</div>}
                </div>
             </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setPaletteOpen(true)} 
                className="group flex items-center gap-3 px-3 py-1.5 rounded-lg border border-brand-border/50 bg-brand-dark/50 hover:bg-brand-surface hover:border-brand-accent/30 transition-all text-xs text-brand-text-secondary hover:text-brand-text shadow-sm"
              >
                <div className="flex items-center gap-2">
                    <CommandIcon className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity"/>
                    <span className="hidden sm:inline">Search...</span>
                </div>
                <kbd className="hidden lg:inline-flex items-center gap-1 font-sans bg-white/5 px-1.5 py-0.5 rounded border border-white/10 text-[10px]">
                    {isMac ? '⌘' : 'Ctrl'} K
                </kbd>
              </button>
            </div>
        </header>

        {announcement && (
            <div className="bg-brand-accent/10 border-b border-brand-accent/20 backdrop-blur-sm text-brand-accent px-4 py-2 text-center text-xs font-semibold flex items-center justify-center animate-fade-in relative z-0">
                <AlertTriangleIcon className="w-4 h-4 mr-2 animate-pulse"/> 
                <span>{announcement}</span>
            </div>
        )}
        
        <div className="flex-1 overflow-x-hidden overflow-y-auto scroll-smooth">
            <div className="p-4 md:p-8 pb-24 max-w-7xl mx-auto">
                {children}
            </div>
        </div>
        <Icicle gear5Mode={gear5Mode} />
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