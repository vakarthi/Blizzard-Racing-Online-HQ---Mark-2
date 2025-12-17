
import React, { createContext, useContext, ReactNode, useEffect, useCallback, SetStateAction } from 'react';
import { User, Task, AeroResult, FinancialRecord, Sponsor, NewsPost, CarHighlight, DiscussionThread, DiscussionPost, UserRole, SponsorTier, CompetitionProgressItem, Protocol, TaskStatus, PublicPortalContent, ContentVersion, LoginRecord, Inquiry, BackgroundTask } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useSyncedStore } from '../hooks/useSyncedStore';
import { generateAvatar } from '../utils/avatar';
import { analyzeStepFile } from '../services/fileAnalysisService';
import { runAerotestCFDSimulation, runAerotestPremiumCFDSimulation } from '../services/simulationService';
import { generateAeroSuggestions, performScrutineering } from '../services/localSimulationService';


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

// Fix: Export DataContextType to make it available for other modules.
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
  // Auth State remains in localStorage as it's session-specific
  const [user, setUser] = useLocalStorage<User | null>('brh-user', null);
  const [biometricConfig, setBiometricConfigState] = useLocalStorage<BiometricConfig | null>('brh-biometric-config', null);
  
  // All shared application data now comes from a single, synchronized source.
  const [store, updateStore] = useSyncedStore();

  const logout = useCallback(() => {
    setUser(null);
    window.location.hash = '/login';
  }, [setUser]);

  const setUsers = (action: SetStateAction<User[]>) => {
    updateStore(currentStore => {
        const newUsers = action instanceof Function ? action(currentStore.users) : action;
        return { ...currentStore, users: newUsers };
    });
  };
  
  // Security Patch: On initial load, purge any users without a valid domain and log out an invalid active user.
  useEffect(() => {
    // Purge invalid users on initial load
    setUsers(currentUsers => {
        const validUsers = currentUsers.filter(u => u.email.toLowerCase().endsWith('@saintolaves.net'));
        if (validUsers.length < currentUsers.length) {
            console.warn("Security Alert: Unauthorized user accounts detected and removed from the system.");
        }
        return validUsers;
    });

    // Log out current user if they are invalid
    if (user && !user.email.toLowerCase().endsWith('@saintolaves.net')) {
        console.warn(`Security Alert: Active session for unauthorized user ${user.email} detected. Terminating session.`);
        logout();
    }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []); // Run only once on mount

    // State Synchronization: Ensure the current user's session data is consistent with the master user list.
    // This handles cases where a manager modifies a user's role or deletes their account in another tab.
    useEffect(() => {
        if (user) {
            const userFromMasterList = store.users.find(u => u.id === user.id);
            
            if (!userFromMasterList) {
                // The current user was deleted from the master list; force logout.
                console.warn(`Active user ${user.email} not found in master list. Forcing logout.`);
                logout();
            } else if (JSON.stringify(user) !== JSON.stringify(userFromMasterList)) {
                // The user's data (e.g., name, role) has changed; update their session.
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
        updateStore(s => ({ ...s, loginHistory: [{ userId: foundUser.id, timestamp: new Date().toISOString() }, ...s.loginHistory]}));
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

  // --- Data Logic (all functions now use the central `updateStore` dispatcher) ---
  const addAeroResult = (result: Omit<AeroResult, 'id'>): AeroResult => {
      const newResult: AeroResult = { ...result, id: `aero-${Date.now()}` };
      updateStore(s => ({ ...s, aeroResults: [newResult, ...s.aeroResults] }));
      return newResult;
  };

  const runSimulationTask = (file: File, mode: 'speed' | 'accuracy') => {
    const taskId = `sim-${Date.now()}`;
    // Audit every 5th speed run
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

    updateStore(s => ({
        ...s,
        backgroundTasks: [newTask, ...s.backgroundTasks],
        simulationRunCount: s.simulationRunCount + 1,
    }));

    // This is an async IIFE, "fire and forget"
    (async () => {
      try {
        updateStore(s => ({ ...s, backgroundTasks: s.backgroundTasks.map(t => t.id === taskId ? { ...t, stage: 'Analyzing Geometry...', progress: 1, latestLog: `Analyzing file: ${file.name}` } : t) }));
        const parameters = await analyzeStepFile(file);
        
        const onProgress = (update: { stage: string; progress: number; log?: string }) => {
            const progressScale = isAuditRun ? 0.9 : 1.0;
            updateStore(s => ({
              ...s,
              backgroundTasks: s.backgroundTasks.map(t => {
                if (t.id === taskId) {
                  return { ...t, stage: update.stage, progress: update.progress * progressScale, latestLog: update.log };
                }
                return t;
              })
            }));
        };
        
        const tier = mode === 'speed' ? 'standard' : 'premium';

        let simResultData;
        if (tier === 'standard') {
            simResultData = await runAerotestCFDSimulation(parameters, onProgress);
        } else {
            // For accuracy mode (premium), we always use the pro-competition thrust model implicitly
            simResultData = await runAerotestPremiumCFDSimulation(parameters, onProgress);
        }
        
        const tempResultForAnalysis: AeroResult = {
            ...simResultData, id: 'temp', fileName: file.name, parameters,
        };
        const suggestions = generateAeroSuggestions(tempResultForAnalysis);
        const scrutineeringReport = performScrutineering(parameters);
        
        const finalResultData: Omit<AeroResult, 'id'> = { ...simResultData, fileName: file.name, suggestions, scrutineeringReport };

        // --- DUAL RUN AUDIT STAGE ---
        if (isAuditRun) {
            updateStore(s => ({...s, backgroundTasks: s.backgroundTasks.map(t => t.id === taskId ? {...t, stage: 'Audit Run', progress: 90, latestLog: 'Initiating high-fidelity baseline...'} : t)}));
            
            // Run a premium sim for audit baseline
            const auditSimData = await runAerotestPremiumCFDSimulation(parameters, () => {});
            
            updateStore(s => ({...s, backgroundTasks: s.backgroundTasks.map(t => t.id === taskId ? {...t, progress: 95, latestLog: 'Comparing results against baseline...'} : t)}));

            const deltaCd = Math.abs(auditSimData.cd - simResultData.cd);
            const deltaCl = Math.abs(auditSimData.cl - simResultData.cl);
            
            const cdDrift = (deltaCd / simResultData.cd) > 0.03;
            const clIsSignificant = Math.abs(simResultData.cl) > 1e-4;
            const clDrift = clIsSignificant && (deltaCl / Math.abs(simResultData.cl)) > 0.05;

            const driftDetected = cdDrift || clDrift;

            finalResultData.auditLog = `Dual-run audit complete. Baseline Cd: ${auditSimData.cd.toFixed(4)} (Δ: ${(deltaCd).toFixed(4)}). ${driftDetected ? 'Drift WARNING: Results deviate significantly from high-fidelity baseline.' : 'Results within tolerance of high-fidelity baseline.'}`;
        }
        
        const newResult = addAeroResult(finalResultData);

        updateStore(s => ({
          ...s,
          backgroundTasks: s.backgroundTasks.map(t => t.id === taskId ? {
            ...t,
            status: 'completed',
            progress: 100,
            stage: 'Complete',
            endTime: new Date().toISOString(),
            resultId: newResult.id,
          } : t)
        }));

      } catch (e: any) {
        console.error("Simulation task failed:", e);
        updateStore(s => ({
          ...s,
          backgroundTasks: s.backgroundTasks.map(t => t.id === taskId ? {
            ...t,
            status: 'error',
            endTime: new Date().toISOString(),
            error: e.message || String(e),
          } : t)
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
      updateStore(s => ({ ...s, publicPortalContentHistory: [newVersion, ...s.publicPortalContentHistory]}));
  };

  const revertToVersion = (versionIndex: number) => {
      if (!user || versionIndex < 0 || versionIndex >= store.publicPortalContentHistory.length) return;
      updateStore(s => {
          const historyCopy = [...s.publicPortalContentHistory];
          const versionToRestore = historyCopy.splice(versionIndex, 1)[0];
          if (!versionToRestore) return s;
          const newCurrentVersion: ContentVersion = { content: versionToRestore.content, timestamp: new Date().toISOString(), editorId: user.id };
          return { ...s, publicPortalContentHistory: [newCurrentVersion, ...historyCopy] };
      });
  };

  const addUser = (user: Omit<User, 'id' | 'avatarUrl'>): boolean => {
    if (!user.email.toLowerCase().endsWith('@saintolaves.net')) {
        alert('Security Breach Prevented: Invalid email domain. All team members must use a "@saintolaves.net" email address.');
        return false;
    }
    const newUser: User = { ...user, id: `user-${Date.now()}`, avatarUrl: generateAvatar(user.name) };
    updateStore(s => ({ ...s, users: [newUser, ...s.users] }));
    return true;
  };

  const updateUser = (userId: string, name: string) => {
    updateStore(s => ({ ...s, users: s.users.map(u => u.id === userId ? { ...u, name } : u) }));
  };
  
  const updateUserAvatar = (userId: string, avatarDataUrl: string) => {
    updateStore(s => ({ ...s, users: s.users.map(u => u.id === userId ? { ...u, avatarUrl: avatarDataUrl } : u) }));
  };

  const changePassword = async (userId: string, newPassword: string): Promise<boolean> => {
    console.log(`Password for user ${userId} changed to "${newPassword}". This is a mock action.`);
    return true;
  };

  const addTask = (task: Omit<Task, 'id' | 'status'>) => {
    const newTask: Task = { ...task, id: `task-${Date.now()}`, status: TaskStatus.ToDo };
    updateStore(s => ({ ...s, tasks: [newTask, ...s.tasks] }));
  };

  const updateTask = (updatedTask: Task) => {
    updateStore(s => ({ ...s, tasks: s.tasks.map(task => task.id === updatedTask.id ? updatedTask : task) }));
  };

  const deleteTask = (taskId: string) => {
    updateStore(s => ({ ...s, tasks: s.tasks.filter(t => t.id !== taskId)}));
  };
  
  const updateAeroResult = (updatedResult: AeroResult) => {
    updateStore(s => ({ ...s, aeroResults: s.aeroResults.map(result => result.id === updatedResult.id ? updatedResult : result) }));
  };

  const resetAeroResults = () => {
    updateStore(s => ({ ...s, aeroResults: [] }));
  };

  const addFinancialRecord = (record: Omit<FinancialRecord, 'id' | 'date'>) => {
    const newRecord: FinancialRecord = { ...record, id: `fin-${Date.now()}`, date: new Date().toISOString() };
    updateStore(s => ({ ...s, finances: [newRecord, ...s.finances].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())}));
  };

  const deleteFinancialRecord = (recordId: string) => {
    updateStore(s => ({ ...s, finances: s.finances.filter(f => f.id !== recordId)}));
  };

  const addSponsor = (sponsor: Omit<Sponsor, 'id' | 'logoUrl' | 'status'>) => {
    const newSponsor: Sponsor = { ...sponsor, id: `spon-${Date.now()}`, logoUrl: `https://picsum.photos/seed/${sponsor.name.replace(/\s/g, '')}/200/100`, status: 'pending' };
    updateStore(s => ({ ...s, sponsors: [newSponsor, ...s.sponsors]}));
  };

  const updateSponsorStatus = (sponsorId: string, status: 'pending' | 'secured') => {
    updateStore(s => ({ ...s, sponsors: s.sponsors.map(sp => sp.id === sponsorId ? {...sp, status} : sp)}));
  };

  const deleteSponsor = (sponsorId: string) => {
    updateStore(s => ({ ...s, sponsors: s.sponsors.filter(sp => sp.id !== sponsorId)}));
  };

  const addNewsPost = (post: Omit<NewsPost, 'id' | 'authorId' | 'createdAt'>) => {
    if (!user) return;
    const newPost: NewsPost = { ...post, id: `news-${Date.now()}`, authorId: user.id, createdAt: new Date().toISOString() };
    updateStore(s => ({ ...s, news: [newPost, ...s.news] }));
  };
  
  const updateNewsPost = (updatedPost: NewsPost) => {
    updateStore(s => ({ ...s, news: s.news.map(p => p.id === updatedPost.id ? updatedPost : p)}));
  };

  const deleteNewsPost = (postId: string) => {
    updateStore(s => ({ ...s, news: s.news.filter(p => p.id !== postId)}));
  };

  const addCarHighlight = (highlight: Omit<CarHighlight, 'id' | 'imageUrl'>) => {
    const newHighlight: CarHighlight = { ...highlight, id: `car-${Date.now()}`, imageUrl: `https://picsum.photos/seed/car${Date.now()}/800/600` };
    updateStore(s => ({ ...s, carHighlights: [newHighlight, ...s.carHighlights]}));
  };
  
  const updateCarHighlight = (updatedHighlight: CarHighlight) => {
    updateStore(s => ({ ...s, carHighlights: s.carHighlights.map(h => h.id === updatedHighlight.id ? updatedHighlight : h)}));
  };

  const deleteCarHighlight = (highlightId: string) => {
    updateStore(s => ({ ...s, carHighlights: s.carHighlights.filter(h => h.id !== highlightId)}));
  };

  const addThread = (title: string, content: string, authorId: string) => {
    const newPost: DiscussionPost = { id: `post-${Date.now()}`, authorId, content, createdAt: new Date().toISOString() };
    const newThread: DiscussionThread = { id: `thread-${Date.now()}`, title, createdBy: authorId, createdAt: new Date().toISOString(), posts: [newPost] };
    updateStore(s => ({ ...s, discussionThreads: [newThread, ...s.discussionThreads]}));
  };

  const addPostToThread = (threadId: string, content: string, authorId: string) => {
    const newPost: DiscussionPost = { id: `post-${Date.now()}`, authorId, content, createdAt: new Date().toISOString() };
    updateStore(s => ({ ...s, discussionThreads: s.discussionThreads.map(thread => thread.id === threadId ? { ...thread, posts: [...thread.posts, newPost] } : thread)}));
  };

  const updateCompetitionProgress = (updates: CompetitionProgressItem[]) => {
    updateStore(s => ({ ...s, competitionProgress: updates }));
  };

  const addProtocol = (protocol: Omit<Protocol, 'id'>) => {
    const newProtocol: Protocol = { ...protocol, id: `proto-${Date.now()}`};
    updateStore(s => ({ ...s, protocols: [newProtocol, ...s.protocols]}));
  };

  const updateProtocol = (updatedProtocol: Protocol) => {
    updateStore(s => ({ ...s, protocols: s.protocols.map(p => p.id === updatedProtocol.id ? updatedProtocol : p)}));
  };

  const deleteProtocol = (protocolId: string) => {
    updateStore(s => ({ ...s, protocols: s.protocols.filter(p => p.id !== protocolId)}));
  };

  const addInquiry = (inquiry: Omit<Inquiry, 'id' | 'timestamp' | 'status'>) => {
    const newInquiry: Inquiry = { ...inquiry, id: `inq-${Date.now()}`, timestamp: new Date().toISOString(), status: 'pending' };
    updateStore(s => ({...s, inquiries: [newInquiry, ...s.inquiries]}));
  };

  const updateInquiryStatus = (inquiryId: string, status: 'accepted' | 'rejected') => {
    updateStore(s => ({
        ...s,
        inquiries: s.inquiries.map(inq =>
            inq.id === inquiryId ? { ...inq, status } : inq
        )
    }));
  };

  const getTeamMember = useCallback((userId: string) => {
    return store.users.find(u => u.id === userId);
  }, [store.users]);

  const loadData = (data: any) => {
    // This function now replaces the entire store, used for importing backups.
    updateStore(currentStore => ({
        ...currentStore,
        users: data.users || currentStore.users,
        tasks: data.tasks || currentStore.tasks,
        aeroResults: data.aeroResults || currentStore.aeroResults,
        finances: data.finances || currentStore.finances,
        sponsors: data.sponsors || currentStore.sponsors,
        news: data.news || currentStore.news,
        carHighlights: data.carHighlights || currentStore.carHighlights,
        discussionThreads: data.discussionThreads || currentStore.discussionThreads,
        announcement: data.announcement !== undefined ? data.announcement : currentStore.announcement,
        competitionDate: data.competitionDate !== undefined ? data.competitionDate : currentStore.competitionDate,
        competitionProgress: data.competitionProgress || currentStore.competitionProgress,
        protocols: data.protocols || currentStore.protocols,
        teamLogoUrl: data.teamLogoUrl || currentStore.teamLogoUrl,
        publicPortalContentHistory: data.publicPortalContentHistory || currentStore.publicPortalContentHistory,
        loginHistory: data.loginHistory || currentStore.loginHistory,
        inquiries: data.inquiries || currentStore.inquiries,
        backgroundTasks: data.backgroundTasks || currentStore.backgroundTasks,
        simulationRunCount: data.simulationRunCount || 0,
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
  };

  const appStateContextValue: AppStateContextType = {
      announcement: store.announcement,
      setAnnouncement: (message: string | null) => updateStore(s => ({...s, announcement: message})),
      competitionDate: store.competitionDate,
      setCompetitionDate: (date: string) => updateStore(s => ({...s, competitionDate: date})),
      teamLogoUrl: store.teamLogoUrl,
      setTeamLogoUrl: (url: string) => updateStore(s => ({...s, teamLogoUrl: url})),
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
