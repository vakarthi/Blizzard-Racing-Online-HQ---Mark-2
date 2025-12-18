
import React, { createContext, useContext, ReactNode, useEffect, useCallback, useState, useRef } from 'react';
import { User, Task, AeroResult, FinancialRecord, Sponsor, NewsPost, CarHighlight, DiscussionThread, DiscussionPost, UserRole, SponsorTier, CompetitionProgressItem, Protocol, TaskStatus, PublicPortalContent, ContentVersion, LoginRecord, Inquiry, BackgroundTask } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useSyncedStore } from '../hooks/useSyncedStore';
import { generateAvatar } from '../utils/avatar';
import { analyzeStepFile } from '../services/fileAnalysisService';
import { runAerotestCFDSimulation, runAerotestPremiumCFDSimulation } from '../services/simulationService';
import { generateAeroSuggestions, performScrutineering } from '../services/localSimulationService';
import { cloudSyncService } from '../services/cloudSyncService';
import { AppStore } from '../services/stateSyncService';

// --- CONTEXT DEFINITIONS ---

interface BiometricConfig {
    userId: string;
    credentialId: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<User | null>;
  logout: () => void;
  verifyPassword: (password: string) => Promise<boolean>;
  getBiometricConfig: () => BiometricConfig | null;
  setBiometricConfig: (userId: string, credentialId: string) => void;
  clearBiometricConfig: () => void;
}

export interface DataContextType {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  addUser: (user: Omit<User, 'id' | 'avatarUrl'>) => boolean;
  updateUser: (userId: string, name: string) => void;
  updateUserAvatar: (userId: string, avatarDataUrl: string) => void;
  changePassword: (userId: string, newPassword: string) => Promise<boolean>;
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'status'>) => void;
  updateTask: (updatedTask: Task) => void;
  deleteTask: (taskId: string) => void;
  aeroResults: AeroResult[];
  addAeroResult: (result: Omit<AeroResult, 'id'>) => AeroResult;
  updateAeroResult: (updatedResult: AeroResult) => void;
  resetAeroResults: () => void;
  finances: FinancialRecord[];
  addFinancialRecord: (record: Omit<FinancialRecord, 'id' | 'date'>) => void;
  deleteFinancialRecord: (recordId: string) => void;
  sponsors: Sponsor[];
  addSponsor: (sponsor: Omit<Sponsor, 'id' | 'logoUrl' | 'status'>) => void;
  updateSponsorStatus: (sponsorId: string, status: 'pending' | 'secured') => void;
  deleteSponsor: (sponsorId: string) => void;
  news: NewsPost[];
  addNewsPost: (post: Omit<NewsPost, 'id' | 'authorId' | 'createdAt'>) => void;
  updateNewsPost: (updatedPost: NewsPost) => void;
  deleteNewsPost: (postId: string) => void;
  carHighlights: CarHighlight[];
  addCarHighlight: (highlight: Omit<CarHighlight, 'id' | 'imageUrl'>) => void;
  updateCarHighlight: (updatedHighlight: CarHighlight) => void;
  deleteCarHighlight: (highlightId: string) => void;
  discussionThreads: DiscussionThread[];
  addThread: (title: string, content: string, authorId: string) => void;
  addPostToThread: (threadId: string, content: string, authorId: string) => void;
  competitionProgress: CompetitionProgressItem[];
  updateCompetitionProgress: (updates: CompetitionProgressItem[]) => void;
  protocols: Protocol[];
  addProtocol: (protocol: Omit<Protocol, 'id'>) => void;
  updateProtocol: (updatedProtocol: Protocol) => void;
  deleteProtocol: (protocolId: string) => void;
  getTeamMember: (userId: string) => User | undefined;
  loadData: (data: any) => void;
  publicPortalContent: PublicPortalContent;
  publicPortalContentHistory: ContentVersion[];
  updatePublicPortalContent: (newContent: PublicPortalContent) => void;
  revertToVersion: (versionIndex: number) => void;
  loginHistory: LoginRecord[];
  inquiries: Inquiry[];
  addInquiry: (inquiry: Omit<Inquiry, 'id' | 'timestamp' | 'status'>) => void;
  updateInquiryStatus: (inquiryId: string, status: 'accepted' | 'rejected') => void;
  backgroundTasks: BackgroundTask[];
  runSimulationTask: (file: File, mode: 'speed' | 'accuracy') => void;
  simulationRunCount: number;
  // --- Sync Members ---
  syncId: string | null;
  setSyncId: (id: string | null) => void;
  isSyncing: boolean;
  pushToCloud: () => Promise<void>;
  pullFromCloud: () => Promise<void>;
}

interface AppStateContextType {
    announcement: string | null;
    setAnnouncement: (message: string | null) => void;
    competitionDate: string | null;
    setCompetitionDate: (date: string) => void;
    teamLogoUrl: string;
    setTeamLogoUrl: (url: string) => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);
const DataContext = createContext<DataContextType | undefined>(undefined);
const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

// --- PROVIDER COMPONENT ---

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useLocalStorage<User | null>('brh-user', null);
  const [biometricConfig, setBiometricConfigState] = useLocalStorage<BiometricConfig | null>('brh-biometric-config', null);
  const [syncId, setSyncIdState] = useLocalStorage<string | null>('brh-sync-id', '1100318042459734016'); 
  const [isSyncing, setIsSyncing] = useState(false);
  const isPullingRef = useRef(false);

  const [store, updateStore] = useSyncedStore();

  const logout = useCallback(() => {
    setUser(null);
    window.location.hash = '/login';
  }, [setUser]);

  const setUsers = (action: React.SetStateAction<User[]>) => {
    updateStore(currentStore => {
        const newUsers = action instanceof Function ? action(currentStore.users) : action;
        return { ...currentStore, users: newUsers };
    });
  };
  
  // Cloud Logic
  const pushToCloud = async (overrideStore?: AppStore) => {
    if (!syncId) return;
    setIsSyncing(true);
    try {
      const dataToPush = overrideStore || store;
      const newId = await cloudSyncService.publish(dataToPush, syncId);
      if (newId !== syncId) setSyncIdState(newId);
    } catch (e) {
      console.warn("Auto-sync push failed. Background retries will continue.");
    } finally {
      setIsSyncing(false);
    }
  };

  const pullFromCloud = async () => {
    if (!syncId || isPullingRef.current) return;
    isPullingRef.current = true;
    setIsSyncing(true);
    try {
      const remoteStore = await cloudSyncService.pull(syncId);
      // We only update if something actually changed to prevent infinite re-renders
      if (JSON.stringify(remoteStore) !== JSON.stringify(store)) {
        updateStore(() => remoteStore);
      }
    } catch (e) {
      // Quietly log to avoid disruptive user messages
      console.warn("Pull cycle skipped due to network/CORS issues.");
    } finally {
      setIsSyncing(false);
      isPullingRef.current = false;
    }
  };

  const updateAndBroadcast = (updater: (s: AppStore) => AppStore) => {
      updateStore((current) => {
          const next = updater(current);
          setTimeout(() => pushToCloud(next), 500);
          return next;
      });
  };

  // Auto-sync polling: 20 seconds
  useEffect(() => {
    if (!syncId) return;
    pullFromCloud();

    const interval = setInterval(() => {
        pullFromCloud();
    }, 20000); 

    return () => clearInterval(interval);
  }, [syncId]);

  // Security Purge
  useEffect(() => {
    setUsers(currentUsers => {
        const validUsers = currentUsers.filter(u => u.email.toLowerCase().endsWith('@saintolaves.net'));
        return validUsers;
    });
    if (user && !user.email.toLowerCase().endsWith('@saintolaves.net')) {
        logout();
    }
  }, []);

  // State Sync
  useEffect(() => {
        if (user) {
            const userFromMasterList = store.users.find(u => u.id === user.id);
            if (!userFromMasterList) {
                logout();
            } else if (JSON.stringify(user) !== JSON.stringify(userFromMasterList)) {
                setUser(userFromMasterList);
            }
        }
  }, [store.users, user, setUser, logout]);


  // Auth Logic
  const login = async (email: string, pass: string): Promise<User | null> => {
    const normalizedEmail = email.toLowerCase().trim();
    if (!normalizedEmail.endsWith('@saintolaves.net')) return null;
    const foundUser = store.users.find(u => u.email.toLowerCase() === normalizedEmail);
    if (!foundUser) return null;
    const isValidPassword = (pass === '__BIOMETRIC_SUCCESS__') ||
        (foundUser.role === UserRole.Manager && pass === '__FROSTNOVA__') ||
        (foundUser.role !== UserRole.Manager && pass === 'password123');
    if (isValidPassword) {
        setUser(foundUser);
        updateAndBroadcast(s => ({ ...s, loginHistory: [{ userId: foundUser.id, timestamp: new Date().toISOString() }, ...s.loginHistory]}));
        return foundUser;
    }
    return null;
  };

  const verifyPassword = async (password: string): Promise<boolean> => {
    if (!user || user.role !== UserRole.Manager) return false;
    return password === '__FROSTNOVA__';
  };
  
  const getBiometricConfig = () => biometricConfig;
  const setBiometricConfig = (userId: string, credentialId: string) => setBiometricConfigState({ userId, credentialId });
  const clearBiometricConfig = () => setBiometricConfigState(null);

  // --- Data Logic ---
  const addAeroResult = (result: Omit<AeroResult, 'id'>): AeroResult => {
      const newResult: AeroResult = { ...result, id: `aero-${Date.now()}` };
      updateAndBroadcast(s => ({ ...s, aeroResults: [newResult, ...s.aeroResults] }));
      return newResult;
  };

  const runSimulationTask = (file: File, mode: 'speed' | 'accuracy') => {
    const taskId = `sim-${Date.now()}`;
    const isAuditRun = mode === 'speed' && (store.simulationRunCount + 1) % 5 === 0;
    const newTask: BackgroundTask = {
      id: taskId,
      type: 'simulation',
      status: 'running',
      progress: 0,
      stage: 'Preparing...',
      startTime: new Date().toISOString(),
      fileName: file.name,
    };
    updateAndBroadcast(s => ({
        ...s,
        backgroundTasks: [newTask, ...s.backgroundTasks],
        simulationRunCount: s.simulationRunCount + 1,
    }));
    (async () => {
      try {
        updateStore(s => ({ ...s, backgroundTasks: s.backgroundTasks.map(t => t.id === taskId ? { ...t, stage: 'Analyzing Geometry...', progress: 1 } : t) }));
        const parameters = await analyzeStepFile(file);
        const onProgress = (update: { stage: string; progress: number; log?: string }) => {
            const progressScale = isAuditRun ? 0.9 : 1.0;
            updateStore(s => ({
              ...s,
              backgroundTasks: s.backgroundTasks.map(t => t.id === taskId ? { ...t, stage: update.stage, progress: update.progress * progressScale, latestLog: update.log } : t)
            }));
        };
        const tier = mode === 'speed' ? 'standard' : 'premium';
        let simResultData = (tier === 'standard') ? await runAerotestCFDSimulation(parameters, onProgress) : await runAerotestPremiumCFDSimulation(parameters, onProgress);
        const tempResultForAnalysis: AeroResult = { ...simResultData, id: 'temp', fileName: file.name, parameters };
        const finalResultData: Omit<AeroResult, 'id'> = { ...simResultData, fileName: file.name, suggestions: generateAeroSuggestions(tempResultForAnalysis), scrutineeringReport: performScrutineering(parameters) };
        const newResult = addAeroResult(finalResultData);
        updateAndBroadcast(s => ({
          ...s,
          backgroundTasks: s.backgroundTasks.map(t => t.id === taskId ? { ...t, status: 'completed', progress: 100, stage: 'Complete', endTime: new Date().toISOString(), resultId: newResult.id } : t)
        }));
      } catch (e: any) {
        updateAndBroadcast(s => ({
          ...s,
          backgroundTasks: s.backgroundTasks.map(t => t.id === taskId ? { ...t, status: 'error', endTime: new Date().toISOString(), error: e.message || String(e) } : t)
        }));
      }
    })();
  };

  const { publicPortalContent, publicPortalContentHistory } = {
      publicPortalContent: store.publicPortalContentHistory[0].content,
      publicPortalContentHistory: store.publicPortalContentHistory,
  };
  
  const updatePublicPortalContent = (newContent: PublicPortalContent) => {
      if (!user) return;
      const newVersion: ContentVersion = { content: newContent, timestamp: new Date().toISOString(), editorId: user.id };
      updateAndBroadcast(s => ({ ...s, publicPortalContentHistory: [newVersion, ...s.publicPortalContentHistory]}));
  };

  const revertToVersion = (versionIndex: number) => {
      if (!user || versionIndex < 0 || versionIndex >= store.publicPortalContentHistory.length) return;
      updateAndBroadcast(s => {
          const historyCopy = [...s.publicPortalContentHistory];
          const versionToRestore = historyCopy.splice(versionIndex, 1)[0];
          if (!versionToRestore) return s;
          const newCurrentVersion: ContentVersion = { content: versionToRestore.content, timestamp: new Date().toISOString(), editorId: user.id };
          return { ...s, publicPortalContentHistory: [newCurrentVersion, ...historyCopy] };
      });
  };

  const addUser = (user: Omit<User, 'id' | 'avatarUrl'>): boolean => {
    if (!user.email.toLowerCase().endsWith('@saintolaves.net')) return false;
    const newUser: User = { ...user, id: `user-${Date.now()}`, avatarUrl: generateAvatar(user.name) };
    updateAndBroadcast(s => ({ ...s, users: [newUser, ...s.users] }));
    return true;
  };

  const updateUser = (userId: string, name: string) => {
    updateAndBroadcast(s => ({ ...s, users: s.users.map(u => u.id === userId ? { ...u, name } : u) }));
  };
  
  const updateUserAvatar = (userId: string, avatarDataUrl: string) => {
    updateAndBroadcast(s => ({ ...s, users: s.users.map(u => u.id === userId ? { ...u, avatarUrl: avatarDataUrl } : u) }));
  };

  const changePassword = async (userId: string, newPassword: string): Promise<boolean> => { return true; };

  const addTask = (task: Omit<Task, 'id' | 'status'>) => {
    const newTask: Task = { ...task, id: `task-${Date.now()}`, status: TaskStatus.ToDo };
    updateAndBroadcast(s => ({ ...s, tasks: [newTask, ...s.tasks] }));
  };

  const updateTask = (updatedTask: Task) => {
    updateAndBroadcast(s => ({ ...s, tasks: s.tasks.map(task => task.id === updatedTask.id ? updatedTask : task) }));
  };

  const deleteTask = (taskId: string) => {
    updateAndBroadcast(s => ({ ...s, tasks: s.tasks.filter(t => t.id !== taskId)}));
  };
  
  const updateAeroResult = (updatedResult: AeroResult) => {
    updateAndBroadcast(s => ({ ...s, aeroResults: s.aeroResults.map(result => result.id === updatedResult.id ? updatedResult : result) }));
  };

  const resetAeroResults = () => {
    updateAndBroadcast(s => ({ ...s, aeroResults: [] }));
  };

  const addFinancialRecord = (record: Omit<FinancialRecord, 'id' | 'date'>) => {
    const newRecord: FinancialRecord = { ...record, id: `fin-${Date.now()}`, date: new Date().toISOString() };
    updateAndBroadcast(s => ({ ...s, finances: [newRecord, ...s.finances].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())}));
  };

  const deleteFinancialRecord = (recordId: string) => {
    updateAndBroadcast(s => ({ ...s, finances: s.finances.filter(f => f.id !== recordId)}));
  };

  const addSponsor = (sponsor: Omit<Sponsor, 'id' | 'logoUrl' | 'status'>) => {
    const newSponsor: Sponsor = { ...sponsor, id: `spon-${Date.now()}`, logoUrl: `https://picsum.photos/seed/${sponsor.name.replace(/\s/g, '')}/200/100`, status: 'pending' };
    updateAndBroadcast(s => ({ ...s, sponsors: [newSponsor, ...s.sponsors]}));
  };

  const updateSponsorStatus = (sponsorId: string, status: 'pending' | 'secured') => {
    updateAndBroadcast(s => ({ ...s, sponsors: s.sponsors.map(sp => sp.id === sponsorId ? {...sp, status} : sp)}));
  };

  const deleteSponsor = (sponsorId: string) => {
    updateAndBroadcast(s => ({ ...s, sponsors: s.sponsors.filter(sp => sp.id !== sponsorId)}));
  };

  const addNewsPost = (post: Omit<NewsPost, 'id' | 'authorId' | 'createdAt'>) => {
    if (!user) return;
    const newPost: NewsPost = { ...post, id: `news-${Date.now()}`, authorId: user.id, createdAt: new Date().toISOString() };
    updateAndBroadcast(s => ({ ...s, news: [newPost, ...s.news] }));
  };
  
  const updateNewsPost = (updatedPost: NewsPost) => {
    updateAndBroadcast(s => ({ ...s, news: s.news.map(p => p.id === updatedPost.id ? updatedPost : p)}));
  };

  const deleteNewsPost = (postId: string) => {
    updateAndBroadcast(s => ({ ...s, news: s.news.filter(p => p.id !== postId)}));
  };

  const addCarHighlight = (highlight: Omit<CarHighlight, 'id' | 'imageUrl'>) => {
    const newHighlight: CarHighlight = { ...highlight, id: `car-${Date.now()}`, imageUrl: `https://picsum.photos/seed/car${Date.now()}/800/600` };
    updateAndBroadcast(s => ({ ...s, carHighlights: [newHighlight, ...s.carHighlights]}));
  };
  
  const updateCarHighlight = (updatedHighlight: CarHighlight) => {
    updateAndBroadcast(s => ({ ...s, carHighlights: s.carHighlights.map(h => h.id === updatedHighlight.id ? updatedHighlight : h)}));
  };

  const deleteCarHighlight = (highlightId: string) => {
    updateAndBroadcast(s => ({ ...s, carHighlights: s.carHighlights.filter(h => h.id !== highlightId)}));
  };

  const addThread = (title: string, content: string, authorId: string) => {
    const newPost: DiscussionPost = { id: `post-${Date.now()}`, authorId, content, createdAt: new Date().toISOString() };
    const newThread: DiscussionThread = { id: `thread-${Date.now()}`, title, createdBy: authorId, createdAt: new Date().toISOString(), posts: [newPost] };
    updateAndBroadcast(s => ({ ...s, discussionThreads: [newThread, ...s.discussionThreads]}));
  };

  const addPostToThread = (threadId: string, content: string, authorId: string) => {
    const newPost: DiscussionPost = { id: `post-${Date.now()}`, authorId, content, createdAt: new Date().toISOString() };
    updateAndBroadcast(s => ({ ...s, discussionThreads: s.discussionThreads.map(thread => thread.id === threadId ? { ...thread, posts: [...thread.posts, newPost] } : thread)}));
  };

  const updateCompetitionProgress = (updates: CompetitionProgressItem[]) => {
    updateAndBroadcast(s => ({ ...s, competitionProgress: updates }));
  };

  const addProtocol = (protocol: Omit<Protocol, 'id'>) => {
    const newProtocol: Protocol = { ...protocol, id: `proto-${Date.now()}`};
    updateAndBroadcast(s => ({ ...s, protocols: [newProtocol, ...s.protocols]}));
  };

  const updateProtocol = (updatedProtocol: Protocol) => {
    updateAndBroadcast(s => ({ ...s, protocols: s.protocols.map(p => p.id === updatedProtocol.id ? updatedProtocol : p)}));
  };

  const deleteProtocol = (protocolId: string) => {
    updateAndBroadcast(s => ({ ...s, protocols: s.protocols.filter(p => p.id !== protocolId)}));
  };

  const addInquiry = (inquiry: Omit<Inquiry, 'id' | 'timestamp' | 'status'>) => {
    const newInquiry: Inquiry = { ...inquiry, id: `inq-${Date.now()}`, timestamp: new Date().toISOString(), status: 'pending' };
    updateAndBroadcast(s => ({...s, inquiries: [newInquiry, ...s.inquiries]}));
  };

  const updateInquiryStatus = (inquiryId: string, status: 'accepted' | 'rejected') => {
    updateAndBroadcast(s => ({ ...s, inquiries: s.inquiries.map(inq => inq.id === inquiryId ? { ...inq, status } : inq) }));
  };

  const getTeamMember = useCallback((userId: string) => {
    return store.users.find(u => u.id === userId);
  }, [store.users]);

  const loadData = (data: any) => {
    updateAndBroadcast(currentStore => ({
        ...currentStore,
        ...data,
    }));
  }

  const dataContextValue: DataContextType = {
      ...store,
      setUsers,
      addUser, updateUser, updateUserAvatar, changePassword,
      addTask, updateTask, deleteTask,
      addAeroResult, updateAeroResult, resetAeroResults,
      addFinancialRecord, deleteFinancialRecord,
      addSponsor, updateSponsorStatus, deleteSponsor,
      addNewsPost, updateNewsPost, deleteNewsPost,
      addCarHighlight, updateCarHighlight, deleteCarHighlight,
      addThread, addPostToThread,
      updateCompetitionProgress,
      addProtocol, updateProtocol, deleteProtocol,
      addInquiry,
      updateInquiryStatus,
      getTeamMember,
      loadData,
      publicPortalContent,
      publicPortalContentHistory,
      updatePublicPortalContent,
      revertToVersion,
      runSimulationTask,
      syncId,
      setSyncId: setSyncIdState,
      isSyncing,
      pushToCloud,
      pullFromCloud,
  };

  const appStateContextValue: AppStateContextType = {
      announcement: store.announcement,
      setAnnouncement: (message: string | null) => updateAndBroadcast(s => ({...s, announcement: message})),
      competitionDate: store.competitionDate,
      setCompetitionDate: (date: string) => updateAndBroadcast(s => ({...s, competitionDate: date})),
      teamLogoUrl: store.teamLogoUrl,
      setTeamLogoUrl: (url: string) => updateAndBroadcast(s => ({...s, teamLogoUrl: url})),
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, verifyPassword, getBiometricConfig, setBiometricConfig, clearBiometricConfig }}>
      <DataContext.Provider value={dataContextValue}>
        <AppStateContext.Provider value={appStateContextValue}>
            {children}
        </AppStateContext.Provider>
      </DataContext.Provider>
    </AuthContext.Provider>
  );
};

// --- HOOKS ---

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AppProvider');
  }
  return context;
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within an AppProvider');
  }
  return context;
};

export const useAppState = (): AppStateContextType => {
    const context = useContext(AppStateContext);
    if(context === undefined) {
        throw new Error('useAppState must be used within an AppProvider');
    }
    return context;
}
