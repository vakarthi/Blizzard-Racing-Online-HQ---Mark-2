
import React, { useState, ReactNode, useEffect } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { useAuth, useAppState, useData } from '../contexts/AppContext';
import { UserRole } from '../types';
import { HomeIcon, WindIcon, ClipboardListIcon, LogOutIcon, MenuIcon, XIcon, AlertTriangleIcon, MessageSquareIcon, MessagesSquareIcon, WrenchIcon, SettingsIcon, CommandIcon, Settings2Icon, EditIcon, BriefcaseIcon, GraduationCapIcon, UploadCloudIcon, DollarSignIcon, ShieldCheckIcon, PaletteIcon, BoxIcon } from '../components/icons';
import { useCommandK } from '../hooks/useCommandK';
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

interface NavItem {
  path: string;
  name: string;
  icon: ReactNode;
  roles?: UserRole[];
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [
        { path: '', name: 'Dashboard', icon: <HomeIcon className="w-5 h-5" /> },
    ]
  },
  {
    label: 'Engineering',
    items: [
        { path: 'aero', name: 'Simulation Suite', icon: <WindIcon className="w-5 h-5" />, roles: [UserRole.DesignEngineer, UserRole.ManufacturingEngineer, UserRole.ProjectManager] },
        { path: 'aero-academy', name: 'Technical Docs', icon: <GraduationCapIcon className="w-5 h-5" />, roles: [UserRole.DesignEngineer, UserRole.ProjectManager] },
        { path: 'toolbox', name: 'Expertise Suite', icon: <WrenchIcon className="w-5 h-5" />, roles: [UserRole.DesignEngineer, UserRole.ManufacturingEngineer] },
    ]
  },
  {
    label: 'Enterprise',
    items: [
        { path: 'leads', name: 'Sponsor Leads', icon: <BriefcaseIcon className="w-5 h-5" />, roles: [UserRole.ResourcesManager, UserRole.ProjectManager] },
        { path: 'finances', name: 'Finance Hub', icon: <DollarSignIcon className="w-5 h-5" />, roles: [UserRole.ResourcesManager, UserRole.ProjectManager] },
        { path: 'toolbox', name: 'Resource Suite', icon: <WrenchIcon className="w-5 h-5" />, roles: [UserRole.ResourcesManager] },
    ]
  },
  {
    label: 'Brand',
    items: [
        { path: 'socials', name: 'Comms Strategy', icon: <MessageSquareIcon className="w-5 h-5" />, roles: [UserRole.MarketingManager, UserRole.ProjectManager] },
        { path: 'portal-editor', name: 'Portal CMS', icon: <EditIcon className="w-5 h-5" />, roles: [UserRole.GraphicDesigner, UserRole.ProjectManager] },
        { path: 'toolbox', name: 'Identity Suite', icon: <WrenchIcon className="w-5 h-5" />, roles: [UserRole.MarketingManager, UserRole.GraphicDesigner] },
    ]
  },
  {
    label: 'Workspace',
    items: [
        { path: 'projects', name: 'Critical Path', icon: <ClipboardListIcon className="w-5 h-5" /> },
        { path: 'comms', name: 'Internal Feed', icon: <MessagesSquareIcon className="w-5 h-5" /> },
    ]
  }
];

const HqLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { syncId, isSyncing, pullFromCloud } = useData();
  const { announcement, teamLogoUrl } = useAppState();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isPaletteOpen, setPaletteOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);

  const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000;
  useInactivityTimeout(logout, INACTIVITY_TIMEOUT_MS);

  useEffect(() => {
    setIsMac(/Mac/i.test(navigator.platform));
  }, []);

  useCommandK(() => setPaletteOpen(p => !p));

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-brand-dark-secondary">
      <div className="p-6 flex items-center border-b border-brand-border">
        <div className="bg-white p-1 rounded-md mr-3 border border-brand-border shadow-sm">
            <img src={teamLogoUrl} alt="Logo" className="h-8 w-8 object-contain" />
        </div>
        <h1 className="text-lg font-black text-brand-text tracking-tighter">BLIZZARD<span className="text-brand-accent">HQ</span></h1>
      </div>
      
      <nav className="flex-grow p-4 space-y-8 overflow-y-auto custom-scrollbar">
        {navGroups.map((group, groupIdx) => {
            const filteredItems = group.items.filter(item => !item.roles || (user && item.roles.includes(user.role)));
            if (filteredItems.length === 0) return null;

            return (
                <div key={groupIdx} className="space-y-1">
                    <p className="px-4 text-[10px] font-black text-brand-text-secondary uppercase tracking-[0.2em] mb-2">{group.label}</p>
                    {filteredItems.map(item => (
                        <NavLink
                            key={`${item.name}-${item.path}`}
                            to={item.path}
                            end={item.path === ''}
                            className={({ isActive }) =>
                            `flex items-center px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                                isActive ? 'bg-brand-accent text-brand-dark font-bold shadow-glow-accent' : 'text-brand-text-secondary hover:bg-brand-border hover:text-brand-text'
                            }`
                            }
                            onClick={() => setSidebarOpen(false)}
                        >
                            <span className="flex-shrink-0">{item.icon}</span>
                            <span className="ml-3 text-sm">{item.name}</span>
                        </NavLink>
                    ))}
                </div>
            )
        })}

        {user?.role === UserRole.ProjectManager && (
            <div className="pt-4 border-t border-brand-border space-y-1">
                <p className="px-4 text-[10px] font-black text-brand-text-secondary uppercase tracking-[0.2em] mb-2">Administration</p>
                <NavLink
                    to="manager"
                    className={({ isActive }) =>
                    `flex items-center px-4 py-2.5 rounded-xl transition-all ${
                        isActive ? 'bg-yellow-500 text-brand-dark font-bold' : 'text-brand-text-secondary hover:bg-brand-border'
                    }`
                    }
                    onClick={() => setSidebarOpen(false)}
                >
                    <Settings2Icon className="w-5 h-5" />
                    <span className="ml-3 text-sm font-bold">Judge Auditor</span>
                </NavLink>
            </div>
        )}
      </nav>

      <div className="p-4 bg-brand-dark/30 border-t border-brand-border">
        <div className="flex items-center mb-4 px-2">
          <img src={user?.avatarUrl} alt={user?.name} className="w-10 h-10 rounded-full border border-brand-border object-cover" />
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-bold text-brand-text truncate">{user?.name}</p>
            <p className="text-[10px] font-bold text-brand-accent uppercase tracking-tighter truncate">{user?.role}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
            <NavLink to="settings" className="flex items-center justify-center p-2 rounded-lg bg-brand-surface text-brand-text-secondary hover:bg-brand-border transition-colors">
                <SettingsIcon className="w-4 h-4" />
            </NavLink>
            <button onClick={logout} className="flex items-center justify-center p-2 rounded-lg bg-brand-surface text-brand-text-secondary hover:bg-red-500/20 hover:text-red-400 transition-colors">
                <LogOutIcon className="w-4 h-4" />
            </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-brand-dark">
       {isPaletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} />}
       <div className={`fixed inset-0 bg-brand-dark-secondary z-40 flex flex-col transition-transform duration-300 ease-in-out md:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <SidebarContent />
       </div>

      <aside className="w-64 bg-brand-dark-secondary text-brand-text flex-col flex-shrink-0 hidden md:flex border-r border-brand-border shadow-2xl">
        <SidebarContent />
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="bg-brand-dark-secondary/50 backdrop-blur-xl p-4 flex items-center justify-between z-10 border-b border-brand-border h-16">
             <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-brand-text">
                {sidebarOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
            
            <div className="hidden md:flex items-center gap-2">
                <span className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest bg-brand-dark px-2 py-1 rounded border border-brand-border">Secure Terminal: V2.1.2</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-brand-dark/50 rounded-lg border border-brand-border text-[10px]">
                  <div className={`w-1.5 h-1.5 rounded-full ${isSyncing ? 'bg-yellow-400 animate-pulse' : syncId ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-gray-500'}`}></div>
                  <span className="text-brand-text-secondary font-bold hidden sm:inline uppercase tracking-tighter">{isSyncing ? 'Syncing...' : syncId ? 'Uplink Active' : 'Local Only'}</span>
                  <button onClick={() => pullFromCloud()} className="ml-1 text-brand-text-secondary hover:text-brand-accent transition-colors">
                      <UploadCloudIcon className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                  </button>
              </div>

              <button onClick={() => setPaletteOpen(true)} className="flex items-center gap-2 text-[10px] p-2 rounded-lg border border-brand-border bg-brand-dark/50 hover:bg-brand-border transition-all text-brand-text-secondary font-bold uppercase tracking-widest">
                <CommandIcon className="w-3.5 h-3.5"/>
                <span className="hidden lg:inline">{isMac ? 'CMD' : 'CTRL'} + K</span>
              </button>
            </div>
        </header>

        {announcement && (
            <div className="bg-brand-accent/10 border-b border-brand-accent/30 text-brand-accent px-4 py-2 text-center text-[10px] font-black uppercase tracking-widest flex items-center justify-center animate-fade-in">
                <AlertTriangleIcon className="w-3.5 h-3.5 mr-2 animate-pulse"/> {announcement}
            </div>
        )}
        
        <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 lg:p-10 pb-24 relative">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-accent/20 to-transparent"></div>
            {children}
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
                {user?.role === UserRole.ProjectManager && <Route path="manager" element={<ManagerPanelGate />} />}
                <Route path="*" element={<div>Not Found</div>} />
            </Routes>
        </HqLayout>
    );
};

export default HqApp;
