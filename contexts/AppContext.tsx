
import React, { createContext, useContext, ReactNode, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useSyncedStore } from '../hooks/useSyncedStore';
import { AppStore, stateSyncService } from '../services/stateSyncService';
import {
  User, Task, AeroResult, FinancialRecord, Sponsor, NewsPost, CarHighlight,
  DiscussionThread, CompetitionProgressItem, Protocol, PublicPortalContent,
  LoginRecord, Inquiry, BackgroundTask, UserRole, DesignParameters, CarClass,
  ContentVersion, TaskStatus, SponsorTier, DiscussionPost, PunkRecordsState, SyncStatus, Session
} from '../types';
import { analyzeStepFile } from '../services/fileAnalysisService';
import { runAerotestCFDSimulation, runAerotestPremiumCFDSimulation } from '../services/simulationService';
import { generateAeroSuggestions, performScrutineering } from '../services/localSimulationService';
import { generateAvatar } from '../utils/avatar';
import { useTheme } from './ThemeContext';

// --- Context Types ---

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  verifyPassword: (password: string) => Promise<boolean>;
  getBiometricConfig: () => { userId: string; credentialId: string } | null;
  setBiometricConfig: (userId: string, credentialId: string) => void;
  clearBiometricConfig: () => void;
}

export interface DataContextType {
  users: User[];
  tasks: Task[];
  aeroResults: AeroResult[];
  finances: FinancialRecord[];
  sponsors: Sponsor[];
  news: NewsPost[];
  carHighlights: CarHighlight[];
  discussionThreads: DiscussionThread[];
  competitionProgress: CompetitionProgressItem[];
  protocols: Protocol[];
  publicPortalContent: PublicPortalContent;
  publicPortalContentHistory: ContentVersion[];
  loginHistory: LoginRecord[];
  inquiries: Inquiry[];
  backgroundTasks: BackgroundTask[];
  punkRecords: PunkRecordsState; // Exposed to UI
  activeSessions: Session[];
  
  // Methods
  setUsers: (update: (users: User[]) => User[]) => void; // Helper for Manager Panel
  addUser: (user: Omit<User, 'id' | 'avatarUrl' | 'bounty'>) => boolean;
  updateUser: (id: string, name: string) => void;
  updateUserAvatar: (id: string, avatarUrl: string) => void;
  changePassword: (userId: string, newPassword: string) => Promise<boolean>;
  
  addTask: (task: Omit<Task, 'id' | 'status'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  
  addSponsor: (sponsor: Omit<Sponsor, 'id' | 'logoUrl' | 'status'>) => void;
  updateSponsorStatus: (id: string, status: 'pending' | 'secured') => void;
  deleteSponsor: (id: string) => void;
  
  addNewsPost: (post: Omit<NewsPost, 'id' | 'createdAt' | 'authorId'>) => void;
  updateNewsPost: (post: NewsPost) => void;
  deleteNewsPost: (id: string) => void;
  
  addCarHighlight: (highlight: Omit<CarHighlight, 'id' | 'imageUrl'>) => void;
  updateCarHighlight: (highlight: CarHighlight) => void;
  deleteCarHighlight: (id: string) => void;
  
  updateCompetitionProgress: (progress: CompetitionProgressItem[]) => void;
  
  addProtocol: (protocol: Omit<Protocol, 'id'>) => void;
  updateProtocol: (protocol: Protocol) => void;
  deleteProtocol: (id: string) => void;
  
  updatePublicPortalContent: (content: PublicPortalContent) => void;
  revertToVersion: (index: number) => void;
  
  addInquiry: (inquiry: Omit<Inquiry, 'id' | 'timestamp' | 'status'>) => void;
  updateInquiryStatus: (id: string, status: 'accepted' | 'rejected') => void;
  
  runSimulationTask: (file: File, mode: 'speed' | 'accuracy', carClass: CarClass) => void;
  addAeroResult: (result: Omit<AeroResult, 'id'>) => AeroResult;
  deleteAeroResult: (id: string) => void;
  resetAeroResults: () => void;
  clearBackgroundTasks: () => void;
  
  addFinancialRecord: (record: Omit<FinancialRecord, 'id'>) => void;
  deleteFinancialRecord: (id: string) => void;
  
  addThread: (title: string, content: string, userId: string) => void;
  addPostToThread: (threadId: string, content: string, userId: string) => void;
  
  getTeamMember: (id: string) => User | undefined;
  loadData: (data: Partial<AppStore>) => void;
}

export interface AppStateContextType {
  announcement: string | null;
  setAnnouncement: (text: string | null) => void;
  competitionDate: string | null;
  setCompetitionDate: (date: string | null) => void;
  teamLogoUrl: string;
  setTeamLogoUrl: (url: string) => void;
  syncId: string | null;
  syncStatus: SyncStatus;
  syncLog: string[];
}

// --- Contexts ---

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const DataContext = createContext<DataContextType | undefined>(undefined);
const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

// --- Provider ---

const SATELLITE_NAMES = [
    'Saturn', 'York', 'Atlas', 'Edison', 'Pythagoras', 'Lilith', 'Shaka', 'Stella', 'Mother Flame', 'Joyboy'
];

const MATH_PARTS = ['\\int', '\\partial', '\\nabla', '\\rho', '\\infty', '\\sum', '\\sqrt', '\\alpha', '\\beta', '\\omega', 'C_d', 'v^2', 'Re'];

// Helper to generate sci-fi math noise
const generateMathNoise = (complexity: number) => {
    const parts = [];
    const length = Math.max(3, Math.ceil(complexity / 10));
    for (let i = 0; i < length; i++) {
        parts.push(MATH_PARTS[Math.floor(Math.random() * MATH_PARTS.length)]);
    }
    return parts.join(' ') + (Math.random() > 0.5 ? ' + ' : ' \\cdot ');
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [store, updateStoreUnbound] = useSyncedStore();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { gear5Mode } = useTheme();
  
  const lastActivityRef = useRef<number>(Date.now());
  const currentSessionId = useRef(`sess-${Date.now()}`).current;

  // Sync state
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(stateSyncService.getSyncStatus());
  const [syncLog, setSyncLog] = useState<string[]>(stateSyncService.getSyncLog());

  const updateStore = useCallback((updater: (currentStore: AppStore) => AppStore) => {
      const userMeta = currentUser ? { userId: currentUser.id, userName: currentUser.name } : undefined;
      updateStoreUnbound(updater, userMeta);
  }, [updateStoreUnbound, currentUser]);

  useEffect(() => {
    const unsubStatus = stateSyncService.subscribeToStatus(setSyncStatus);
    const unsubLog = stateSyncService.subscribeToLog(setSyncLog);
    return () => {
        unsubStatus();
        unsubLog();
    }
  }, []);

  // --- ACTIVITY & SESSION HEARTBEAT ---
  useEffect(() => {
      const handleUserActivity = () => {
          const now = Date.now();
          if (now - lastActivityRef.current > 1000) {
              lastActivityRef.current = now;
          }
      };

      const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
      events.forEach(event => window.addEventListener(event, handleUserActivity, { passive: true }));
      
      const heartbeatInterval = setInterval(() => {
          if (!currentUser) return;
          updateStore(s => {
              const now = new Date().toISOString();
              const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
              
              const otherSessions = (s.activeSessions || []).filter(
                  sess => sess.id !== currentSessionId && sess.lastActive > tenMinutesAgo
              );

              const newSession: Session = {
                  id: currentSessionId,
                  userId: currentUser.id,
                  userName: currentUser.name,
                  userAgent: navigator.userAgent,
                  lastActive: now,
                  deviceType: window.innerWidth < 768 ? 'mobile' : 'desktop'
              };

              return { ...s, activeSessions: [...otherSessions, newSession] };
          });
      }, 30000); // Send heartbeat every 30 seconds

      return () => {
          events.forEach(event => window.removeEventListener(event, handleUserActivity));
          clearInterval(heartbeatInterval);
      };
  }, [currentUser, updateStore, currentSessionId]);

  // --- THE CENTRAL LOBE (Evolutionary Combinatorial Compiler) ---
  useEffect(() => {
      if (!currentUser) return;

      const researchLoop = setInterval(() => {
          updateStore(state => {
              const cr = state.punkRecords;
              
              const formulasPerTick = Math.ceil((cr.solverGeneration + 1) * 1.5); 
              let newFormulas = cr.formulasSynthesized + formulasPerTick;
              
              const threshold = 100 * Math.pow(1.2, cr.solverGeneration); 
              let newSyncRate = cr.syncRate + (formulasPerTick / threshold) * 100;

              let newGeneration = cr.solverGeneration;
              let newGenName = cr.generationName;
              let newComplexity = cr.complexityScore;
              let newAccuracy = cr.accuracyRating;
              let newFormulaStr = cr.currentMasterFormula;

              if (newSyncRate >= 100) {
                  newSyncRate = 0;
                  newGeneration += 1;
                  newGenName = SATELLITE_NAMES[(newGeneration - 1) % SATELLITE_NAMES.length] || `OMNI-${newGeneration}`;
                  
                  newComplexity = Math.max(1, cr.complexityScore * 0.90);
                  const gapToPerfection = 100 - cr.accuracyRating;
                  newAccuracy = cr.accuracyRating + (gapToPerfection * 0.15); 

                  newFormulaStr = newGeneration > 8 ? '\\Omega(x)' : generateMathNoise(newComplexity) + ' = 0';
              } else {
                  if (Math.random() > 0.7) {
                      newFormulaStr = `${generateMathNoise(newComplexity)} ...`; 
                  }
              }

              return {
                  ...state,
                  punkRecords: {
                      syncRate: newSyncRate,
                      solverGeneration: newGeneration,
                      generationName: newGenName,
                      formulasSynthesized: newFormulas,
                      currentMasterFormula: newFormulaStr,
                      complexityScore: newComplexity,
                      accuracyRating: newAccuracy
                  }
              };
          });
      }, 500);

      return () => clearInterval(researchLoop);
  }, [currentUser, updateStore]);

  // --- BOUNTY INCREASE LOGIC (Online Activity) ---
  useEffect(() => {
      if (!currentUser) return;

      const bountyInterval = setInterval(() => {
          const timeSinceLastActive = Date.now() - lastActivityRef.current;
          const isActive = timeSinceLastActive < 40000; 

          if (isActive) {
              updateStore(state => {
                  const bountyIncrease = gear5Mode ? 100000 : 1000;
                  const updatedUsers = state.users.map(u => 
                      u.id === currentUser.id 
                      ? { ...u, bounty: (u.bounty || 0) + bountyIncrease }
                      : u
                  );
                  return { ...state, users: updatedUsers };
              });
          }
      }, 60000);

      return () => clearInterval(bountyInterval);
  }, [currentUser, updateStore, gear5Mode]);


  // --- Auth Logic ---
  
  const login = useCallback(async (email: string, password: string): Promise<User | null> => {
    if (password === 'password123' || password === '__BIOMETRIC_SUCCESS__') {
        const user = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (user) {
            setCurrentUser(user);
            updateStore(s => ({
                ...s,
                loginHistory: [...s.loginHistory, { userId: user.id, timestamp: new Date().toISOString() }]
            }));
            return user;
        }
    }
    return null;
  }, [store.users, updateStore]);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const verifyPassword = useCallback(async (password: string): Promise<boolean> => {
      return password === 'password123';
  }, []);

  const getBiometricConfig = useCallback(() => {
      const stored = localStorage.getItem('brh-biometric');
      return stored ? JSON.parse(stored) : null;
  }, []);

  const setBiometricConfig = useCallback((userId: string, credentialId: string) => {
      localStorage.setItem('brh-biometric', JSON.stringify({ userId, credentialId }));
  }, []);

  const clearBiometricConfig = useCallback(() => {
      localStorage.removeItem('brh-biometric');
  }, []);

  // --- Data Logic Helpers ---

  const getTeamMember = useCallback((id: string) => {
      return store.users.find(u => u.id === id);
  }, [store.users]);

  // --- Actions ---

  const setUsers = (updater: (users: User[]) => User[]) => updateStore(s => ({ ...s, users: updater(s.users) }));

  const addUser = (userData: Omit<User, 'id' | 'avatarUrl' | 'bounty'>) => {
      const newUser: User = {
          ...userData,
          id: `user-${Date.now()}`,
          avatarUrl: generateAvatar(userData.name),
          bounty: 1000000
      };
      updateStore(s => ({ ...s, users: [...s.users, newUser] }));
      return true;
  };

  const updateUser = (id: string, name: string) => {
      updateStore(s => ({
          ...s,
          users: s.users.map(u => u.id === id ? { ...u, name, avatarUrl: generateAvatar(name) } : u)
      }));
  };

  const updateUserAvatar = (id: string, avatarUrl: string) => {
      updateStore(s => ({ ...s, users: s.users.map(u => u.id === id ? { ...u, avatarUrl } : u) }));
  };

  const changePassword = async (userId: string, newPassword: string) => true;

  const addTask = (task: Omit<Task, 'id' | 'status'>) => {
      const newTask: Task = { ...task, id: `task-${Date.now()}`, status: TaskStatus.ToDo };
      updateStore(s => ({ ...s, tasks: [...s.tasks, newTask] }));
  };

  const updateTask = (task: Task) => {
      updateStore(s => {
          const oldTask = s.tasks.find(t => t.id === task.id);
          let newUsers = s.users;

          if (oldTask && oldTask.status !== TaskStatus.Done && task.status === TaskStatus.Done && task.assigneeId) {
              newUsers = s.users.map(u =>
                  u.id === task.assigneeId ? { ...u, bounty: (u.bounty || 0) + 1000000 } : u
              );
          }

          return { ...s, tasks: s.tasks.map(t => t.id === task.id ? task : t), users: newUsers };
      });
  };

  const deleteTask = (taskId: string) => updateStore(s => ({ ...s, tasks: s.tasks.filter(t => t.id !== taskId) }));

  const addSponsor = (sponsor: Omit<Sponsor, 'id' | 'logoUrl' | 'status'>) => {
      const newSponsor: Sponsor = { ...sponsor, id: `spon-${Date.now()}`, logoUrl: `https://picsum.photos/seed/${sponsor.name.replace(/\s/g, '')}/200/100`, status: 'pending' };
      updateStore(s => ({ ...s, sponsors: [...s.sponsors, newSponsor] }));
  };

  const updateSponsorStatus = (id: string, status: 'pending' | 'secured') => updateStore(s => ({ ...s, sponsors: s.sponsors.map(sp => sp.id === id ? { ...sp, status } : sp) }));

  const deleteSponsor = (id: string) => updateStore(s => ({ ...s, sponsors: s.sponsors.filter(sp => sp.id !== id) }));

  const addNewsPost = (post: Omit<NewsPost, 'id' | 'createdAt' | 'authorId'>) => {
      const newPost: NewsPost = { ...post, id: `news-${Date.now()}`, createdAt: new Date().toISOString(), authorId: currentUser?.id || 'system' };
      updateStore(s => ({ ...s, news: [...s.news, newPost] }));
  };

  const updateNewsPost = (post: NewsPost) => updateStore(s => ({ ...s, news: s.news.map(p => p.id === post.id ? post : p) }));
  const deleteNewsPost = (id: string) => updateStore(s => ({ ...s, news: s.news.filter(p => p.id !== id) }));

  const addCarHighlight = (highlight: Omit<CarHighlight, 'id' | 'imageUrl'>) => {
      const newHighlight: CarHighlight = { ...highlight, id: `car-${Date.now()}`, imageUrl: `https://picsum.photos/seed/tech${Date.now()}/800/600` };
      updateStore(s => ({ ...s, carHighlights: [...s.carHighlights, newHighlight] }));
  };

  const updateCarHighlight = (highlight: CarHighlight) => updateStore(s => ({ ...s, carHighlights: s.carHighlights.map(h => h.id === highlight.id ? highlight : h) }));
  const deleteCarHighlight = (id: string) => updateStore(s => ({ ...s, carHighlights: s.carHighlights.filter(h => h.id !== id) }));

  const updateCompetitionProgress = (progress: CompetitionProgressItem[]) => updateStore(s => ({ ...s, competitionProgress: progress }));

  const addProtocol = (protocol: Omit<Protocol, 'id'>) => {
      const newProtocol: Protocol = { ...protocol, id: `proto-${Date.now()}` };
      updateStore(s => ({ ...s, protocols: [...s.protocols, newProtocol] }));
  };

  const updateProtocol = (protocol: Protocol) => updateStore(s => ({ ...s, protocols: s.protocols.map(p => p.id === protocol.id ? protocol : p) }));
  const deleteProtocol = (id: string) => updateStore(s => ({ ...s, protocols: s.protocols.filter(p => p.id !== id) }));

  const updatePublicPortalContent = (content: PublicPortalContent) => {
      updateStore(s => ({ ...s, publicPortalContentHistory: [{ content, timestamp: new Date().toISOString(), editorId: currentUser?.id || 'system' }, ...s.publicPortalContentHistory] }));
  };

  const revertToVersion = (index: number) => {
      const version = store.publicPortalContentHistory[index];
      if (version) updatePublicPortalContent(version.content);
  };

  const addInquiry = (inquiry: Omit<Inquiry, 'id' | 'timestamp' | 'status'>) => {
      const newInquiry: Inquiry = { ...inquiry, id: `inq-${Date.now()}`, timestamp: new Date().toISOString(), status: 'pending' };
      updateStore(s => ({ ...s, inquiries: [...s.inquiries, newInquiry] }));
  };

  const updateInquiryStatus = (id: string, status: 'accepted' | 'rejected') => updateStore(s => ({ ...s, inquiries: s.inquiries.map(i => i.id === id ? { ...i, status } : i) }));

  const addAeroResult = (result: Omit<AeroResult, 'id'>) => {
      const newResult: AeroResult = { ...result, id: `aero-${Date.now()}` };
      updateStore(s => ({ ...s, aeroResults: [newResult, ...s.aeroResults] }));
      return newResult;
  };

  const deleteAeroResult = (id: string) => updateStore(s => ({ ...s, aeroResults: s.aeroResults.filter(r => r.id !== id) }));
  const resetAeroResults = () => updateStore(s => ({ ...s, aeroResults: [] }));
  const clearBackgroundTasks = () => updateStore(s => ({ ...s, backgroundTasks: [] }));

  const addFinancialRecord = (record: Omit<FinancialRecord, 'id'>) => {
      const newRecord: FinancialRecord = { ...record, id: `fin-${Date.now()}`, date: new Date().toISOString().split('T')[0] };
      updateStore(s => ({ ...s, finances: [...s.finances, newRecord] }));
  };

  const deleteFinancialRecord = (id: string) => updateStore(s => ({ ...s, finances: s.finances.filter(f => f.id !== id) }));

  const addThread = (title: string, content: string, userId: string) => {
      const newThread: DiscussionThread = { id: `thread-${Date.now()}`, title, createdBy: userId, createdAt: new Date().toISOString(), posts: [{ id: `post-${Date.now()}`, authorId: userId, content, createdAt: new Date().toISOString() }] };
      updateStore(s => ({ ...s, discussionThreads: [newThread, ...s.discussionThreads] }));
  };

  const addPostToThread = (threadId: string, content: string, userId: string) => {
      const newPost: DiscussionPost = { id: `post-${Date.now()}`, authorId: userId, content, createdAt: new Date().toISOString() };
      updateStore(s => ({ ...s, discussionThreads: s.discussionThreads.map(t => t.id === threadId ? { ...t, posts: [...t.posts, newPost] } : t) }));
  };

  const loadData = (data: Partial<AppStore>) => updateStore(s => ({ ...s, ...data }));

  // --- Complex Actions ---

  const runSimulationTask = (file: File, mode: 'speed' | 'accuracy', carClass: CarClass) => {
    const taskId = `sim-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const currentPunkRecords = store.punkRecords;

    const newTask: BackgroundTask = { id: taskId, type: 'simulation', status: 'running', progress: 0, stage: 'Preparing...', startTime: new Date().toISOString(), fileName: file.name };

    updateStore(s => ({ ...s, backgroundTasks: [newTask, ...s.backgroundTasks], simulationRunCount: s.simulationRunCount + 1 }));

    (async () => {
      try {
        updateStore(s => ({ ...s, backgroundTasks: s.backgroundTasks.map(t => t.id === taskId ? { ...t, stage: 'Analyzing Geometry...', progress: 1, latestLog: `Analyzing file: ${file.name}` } : t) }));
        const parameters = await analyzeStepFile(file);
        const scrutineeringReport = performScrutineering(parameters);

        const onProgress = (update: { stage: string; progress: number; log?: string }) => {
            updateStore(s => ({ ...s, backgroundTasks: s.backgroundTasks.map(t => t.id === taskId ? { ...t, stage: update.stage, progress: update.progress, latestLog: update.log } : t) }));
        };
        
        const tier = mode === 'speed' ? 'standard' : 'premium';
        let simResultData = tier === 'standard' 
            ? await runAerotestCFDSimulation(parameters, onProgress, carClass, currentPunkRecords)
            : await runAerotestPremiumCFDSimulation(parameters, onProgress, carClass, currentPunkRecords);
        
        const tempResultForAnalysis: AeroResult = { ...simResultData, id: 'temp', fileName: file.name, parameters };
        const suggestions = generateAeroSuggestions(tempResultForAnalysis);
        
        const finalResultData: Omit<AeroResult, 'id'> = { ...simResultData, fileName: file.name, suggestions, scrutineeringReport };
        const newResult = addAeroResult(finalResultData);

        updateStore(s => ({ ...s, backgroundTasks: s.backgroundTasks.map(t => t.id === taskId ? { ...t, status: 'completed', progress: 100, stage: 'Complete', endTime: new Date().toISOString(), resultId: newResult.id } : t) }));
      } catch (e: any) {
        updateStore(s => ({ ...s, backgroundTasks: s.backgroundTasks.map(t => t.id === taskId ? { ...t, status: 'error', endTime: new Date().toISOString(), error: e.message || String(e) } : t) }));
      }
    })();
  };

  // --- Values ---

  const dataContextValue = useMemo(() => ({
      users: store.users, tasks: store.tasks, aeroResults: store.aeroResults, finances: store.finances, sponsors: store.sponsors, news: store.news, carHighlights: store.carHighlights, discussionThreads: store.discussionThreads, competitionProgress: store.competitionProgress, protocols: store.protocols,
      publicPortalContent: store.publicPortalContentHistory[0]?.content || { home: {}, about: {}, team: {}, car: {}, competition: {}, sponsors: {}, news: {}, contact: {}, aerotest: {} } as any,
      publicPortalContentHistory: store.publicPortalContentHistory, loginHistory: store.loginHistory, inquiries: store.inquiries, backgroundTasks: store.backgroundTasks, punkRecords: store.punkRecords, activeSessions: store.activeSessions || [],
      setUsers, addUser, updateUser, updateUserAvatar, changePassword, addTask, updateTask, deleteTask, addSponsor, updateSponsorStatus, deleteSponsor, addNewsPost, updateNewsPost, deleteNewsPost, addCarHighlight, updateCarHighlight, deleteCarHighlight, updateCompetitionProgress, addProtocol, updateProtocol, deleteProtocol, updatePublicPortalContent, revertToVersion, addInquiry, updateInquiryStatus, runSimulationTask, addAeroResult, deleteAeroResult, resetAeroResults, clearBackgroundTasks, addFinancialRecord, deleteFinancialRecord, addThread, addPostToThread, getTeamMember, loadData
  }), [store, currentUser, updateStore]);

  const appStateContextValue = useMemo(() => ({
      announcement: store.announcement,
      setAnnouncement: (text: string | null) => updateStore(s => ({ ...s, announcement: text })),
      competitionDate: store.competitionDate,
      setCompetitionDate: (date: string | null) => updateStore(s => ({ ...s, competitionDate: date })),
      teamLogoUrl: store.teamLogoUrl,
      setTeamLogoUrl: (url: string) => updateStore(s => ({ ...s, teamLogoUrl: url })),
      syncId: stateSyncService.getSyncId(),
      syncStatus,
      syncLog
  }), [store.announcement, store.competitionDate, store.teamLogoUrl, syncStatus, syncLog, updateStore]);

  const authContextValue = useMemo(() => ({
      user: currentUser, login, logout, verifyPassword, getBiometricConfig, setBiometricConfig, clearBiometricConfig
  }), [currentUser, login, logout, verifyPassword, getBiometricConfig, setBiometricConfig, clearBiometricConfig]);

  return (
    <AppStateContext.Provider value={appStateContextValue}>
      <DataContext.Provider value={dataContextValue}>
        <AuthContext.Provider value={authContextValue}>
          {children}
        </AuthContext.Provider>
      </DataContext.Provider>
    </AppStateContext.Provider>
  );
};

// --- Hooks ---

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AppProvider');
  return context;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) throw new Error('useData must be used within an AppProvider');
  return context;
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) throw new Error('useAppState must be used within an AppProvider');
  return context;
};
