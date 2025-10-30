



import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, SetStateAction } from 'react';
import { User, Task, AeroResult, FinancialRecord, Sponsor, NewsPost, CarHighlight, DiscussionThread, DiscussionPost, UserRole, SponsorTier, CompetitionProgressItem, Protocol, TaskStatus, PublicPortalContent, ContentVersion, LoginRecord } from '../types';
import { MOCK_USERS, MOCK_TASKS, MOCK_FINANCES, MOCK_SPONSORS, MOCK_NEWS, MOCK_CAR_HIGHLIGHTS, MOCK_THREADS, MOCK_COMPETITION_PROGRESS, MOCK_PROTOCOLS, INITIAL_PUBLIC_PORTAL_CONTENT } from '../services/mockData';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateAvatar } from '../utils/avatar';


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
  addAeroResult: (result: Omit<AeroResult, 'id' | 'isBest'>) => AeroResult;
  updateAeroResult: (updatedResult: AeroResult) => void;
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

const DEFAULT_LOGO = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIiBmaWxsPSIjMDBCRkZGIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMS4zIDEuMDQ2QTEgMSAwIDAxMTIgMnY1aDRhMSAxIDAgMDEuODIgMS41NzNsLTcgMTBBMSAxIDAgMDE4IDE4di01SDRhMSAxIDAgMDEtLjgyLTEuNTczbDctMTBhMSAxIDAgMDExLjEyLS4zOHoiIGNsaXAtcnVsZT0iZXZlbm9kZCIgLz48L3N2Zz4=';


// --- PROVIDER COMPONENT ---

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Auth State
  const [user, setUser] = useLocalStorage<User | null>('brh-user', null);
  const [biometricConfig, setBiometricConfigState] = useLocalStorage<BiometricConfig | null>('brh-biometric-config', null);
  
  // Data State
  const [users, setUsers] = useLocalStorage<User[]>('brh-users', MOCK_USERS);
  const [tasks, setTasks] = useLocalStorage<Task[]>('brh-tasks', MOCK_TASKS);
  const [aeroResults, setAeroResults] = useLocalStorage<AeroResult[]>('brh-aero', []);
  const [finances, setFinances] = useLocalStorage<FinancialRecord[]>('brh-finances', MOCK_FINANCES);
  const [sponsors, setSponsors] = useLocalStorage<Sponsor[]>('brh-sponsors', MOCK_SPONSORS);
  const [news, setNews] = useLocalStorage<NewsPost[]>('brh-news', MOCK_NEWS);
  const [carHighlights, setCarHighlights] = useLocalStorage<CarHighlight[]>('brh-car-highlights', MOCK_CAR_HIGHLIGHTS);
  const [discussionThreads, setDiscussionThreads] = useLocalStorage<DiscussionThread[]>('brh-threads', MOCK_THREADS);
  const [competitionProgress, setCompetitionProgress] = useLocalStorage<CompetitionProgressItem[]>('brh-comp-progress', MOCK_COMPETITION_PROGRESS);
  const [protocols, setProtocols] = useLocalStorage<Protocol[]>('brh-protocols', MOCK_PROTOCOLS);
  const [publicPortalContentHistory, setPublicPortalContentHistory] = useLocalStorage<ContentVersion[]>('brh-portal-history', [{
    content: INITIAL_PUBLIC_PORTAL_CONTENT,
    timestamp: new Date().toISOString(),
    editorId: 'system'
  }]);
  const [loginHistory, setLoginHistory] = useLocalStorage<LoginRecord[]>('brh-login-history', []);

  // App State
  const [announcement, setAnnouncement] = useLocalStorage<string | null>('brh-announcement', 'Welcome to the Blizzard Racing HQ! All systems are operational.');
  const [competitionDate, setCompetitionDate] = useLocalStorage<string | null>('brh-comp-date', '2024-12-01T09:00:00');
  const [teamLogoUrl, setTeamLogoUrl] = useLocalStorage<string>('brh-team-logo', DEFAULT_LOGO);

  const logout = useCallback(() => {
    setUser(null);
    window.location.hash = '/login';
  }, [setUser]);
  
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
            const userFromMasterList = users.find(u => u.id === user.id);
            
            if (!userFromMasterList) {
                // The current user was deleted from the master list; force logout.
                console.warn(`Active user ${user.email} not found in master list. Forcing logout.`);
                logout();
            } else if (JSON.stringify(user) !== JSON.stringify(userFromMasterList)) {
                // The user's data (e.g., name, role) has changed; update their session.
                setUser(userFromMasterList);
            }
        }
    }, [users, user, setUser, logout]);


  // Auth Logic
  const login = async (email: string, pass: string): Promise<User | null> => {
    const normalizedEmail = email.toLowerCase().trim();

    // Security Patch: Enforce domain check at login as a redundant safeguard
    if (!normalizedEmail.endsWith('@saintolaves.net')) {
        return null;
    }

    const foundUser = users.find(u => u.email.toLowerCase() === normalizedEmail);

    if (!foundUser) return null;

    const isValidPassword = (pass === '__BIOMETRIC_SUCCESS__') ||
        (foundUser.role === UserRole.Manager && pass === '__HYDRA7__') ||
        (foundUser.role !== UserRole.Manager && pass === 'password123');

    if (isValidPassword) {
        setUser(foundUser);
        setLoginHistory(prev => [
            { userId: foundUser.id, timestamp: new Date().toISOString() },
            ...prev
        ]);
        return foundUser;
    }

    return null;
  };

  const verifyPassword = async (password: string): Promise<boolean> => {
      if (!user) return false;

      if (user.role === UserRole.Manager) {
          return password === '__HYDRA7__';
      }
      return password === 'password123';
  };
  
  const getBiometricConfig = () => biometricConfig;

  const setBiometricConfig = (userId: string, credentialId: string) => {
    setBiometricConfigState({ userId, credentialId });
  };
  
  const clearBiometricConfig = () => {
    setBiometricConfigState(null);
  };


  // Data Logic
  const publicPortalContent = publicPortalContentHistory[0].content;

  const updatePublicPortalContent = (newContent: PublicPortalContent) => {
      if (!user) return;
      const newVersion: ContentVersion = {
          content: newContent,
          timestamp: new Date().toISOString(),
          editorId: user.id
      };
      setPublicPortalContentHistory(prev => [newVersion, ...prev]);
  };

  const revertToVersion = (versionIndex: number) => {
      if (!user || versionIndex <= 0 || versionIndex >= publicPortalContentHistory.length) return;
      setPublicPortalContentHistory(prev => {
          const historyCopy = [...prev];
          const versionToRestore = historyCopy.splice(versionIndex, 1)[0];
          if (!versionToRestore) return prev;
          
          const newCurrentVersion: ContentVersion = {
              content: versionToRestore.content,
              timestamp: new Date().toISOString(),
              editorId: user.id,
          };

          return [newCurrentVersion, ...historyCopy];
      });
  };

  const addUser = (user: Omit<User, 'id' | 'avatarUrl'>): boolean => {
    // Security Patch: Enforce valid email domain for all new users
    if (!user.email.toLowerCase().endsWith('@saintolaves.net')) {
        alert('Security Breach Prevented: Invalid email domain. All team members must use a "@saintolaves.net" email address.');
        return false;
    }

    const newUser: User = {
      ...user,
      id: `user-${Date.now()}`,
      avatarUrl: generateAvatar(user.name),
    };
    setUsers(prev => [newUser, ...prev]);
    return true;
  };

  const updateUser = (userId: string, name: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, name } : u));
    if(user?.id === userId) {
        setUser(prev => prev ? {...prev, name} : null);
    }
  };
  
  const updateUserAvatar = (userId: string, avatarDataUrl: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, avatarUrl: avatarDataUrl } : u));
    if(user?.id === userId) {
        setUser(prev => prev ? {...prev, avatarUrl: avatarDataUrl} : null);
    }
  };

  const changePassword = async (userId: string, newPassword: string): Promise<boolean> => {
    console.log(`Password for user ${userId} changed to "${newPassword}". This is a mock action.`);
    // In a real app, this would involve an API call. Here, we simulate success.
    return true;
  };

  const addTask = (task: Omit<Task, 'id' | 'status'>) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      status: TaskStatus.ToDo,
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(prevTasks => prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };
  
  const addAeroResult = (result: Omit<AeroResult, 'id' | 'isBest'>): AeroResult => {
      let newResult: AeroResult | null = null;
      setAeroResults(prev => {
          const bestLDRatio = Math.max(...prev.map(r => r.liftToDragRatio), 0);
          const isNewBest = result.liftToDragRatio > bestLDRatio;
          
          newResult = {
              ...result,
              id: `aero-${Date.now()}`,
              isBest: isNewBest,
          };
          
          const updatedPreviousResults = isNewBest 
              ? prev.map(r => ({ ...r, isBest: false }))
              : prev;
          
          return [newResult, ...updatedPreviousResults];
      });
      return newResult!;
  };
  
  const updateAeroResult = (updatedResult: AeroResult) => {
    setAeroResults(prevResults => prevResults.map(result => result.id === updatedResult.id ? updatedResult : result));
  };

  const addFinancialRecord = (record: Omit<FinancialRecord, 'id' | 'date'>) => {
    const newRecord: FinancialRecord = { ...record, id: `fin-${Date.now()}`, date: new Date().toISOString() };
    setFinances(prev => [newRecord, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const deleteFinancialRecord = (recordId: string) => {
    setFinances(prev => prev.filter(f => f.id !== recordId));
  };

  const addSponsor = (sponsor: Omit<Sponsor, 'id' | 'logoUrl' | 'status'>) => {
    const newSponsor: Sponsor = {
        ...sponsor,
        id: `spon-${Date.now()}`,
        logoUrl: `https://picsum.photos/seed/${sponsor.name.replace(/\s/g, '')}/200/100`,
        status: 'pending',
    };
    setSponsors(prev => [newSponsor, ...prev]);
  };

  const updateSponsorStatus = (sponsorId: string, status: 'pending' | 'secured') => {
    setSponsors(prev => prev.map(s => s.id === sponsorId ? {...s, status} : s));
  };

  const deleteSponsor = (sponsorId: string) => {
    setSponsors(prev => prev.filter(s => s.id !== sponsorId));
  };

  const addNewsPost = (post: Omit<NewsPost, 'id' | 'authorId' | 'createdAt'>) => {
    if (!user) return;
    const newPost: NewsPost = {
        ...post,
        id: `news-${Date.now()}`,
        authorId: user.id,
        createdAt: new Date().toISOString(),
    };
    setNews(prev => [newPost, ...prev]);
  };
  
  const updateNewsPost = (updatedPost: NewsPost) => {
    setNews(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
  };

  const deleteNewsPost = (postId: string) => {
    setNews(prev => prev.filter(p => p.id !== postId));
  };

  const addCarHighlight = (highlight: Omit<CarHighlight, 'id' | 'imageUrl'>) => {
    const newHighlight: CarHighlight = {
        ...highlight,
        id: `car-${Date.now()}`,
        imageUrl: `https://picsum.photos/seed/car${Date.now()}/800/600`,
    };
    setCarHighlights(prev => [newHighlight, ...prev]);
  };
  
  const updateCarHighlight = (updatedHighlight: CarHighlight) => {
    setCarHighlights(prev => prev.map(h => h.id === updatedHighlight.id ? updatedHighlight : h));
  };

  const deleteCarHighlight = (highlightId: string) => {
    setCarHighlights(prev => prev.filter(h => h.id !== highlightId));
  };

  const addThread = (title: string, content: string, authorId: string) => {
    const newPost: DiscussionPost = {
      id: `post-${Date.now()}`,
      authorId,
      content,
      createdAt: new Date().toISOString(),
    };
    const newThread: DiscussionThread = {
      id: `thread-${Date.now()}`,
      title,
      createdBy: authorId,
      createdAt: new Date().toISOString(),
      posts: [newPost]
    };
    setDiscussionThreads(prev => [newThread, ...prev]);
  };

  const addPostToThread = (threadId: string, content: string, authorId: string) => {
    const newPost: DiscussionPost = {
      id: `post-${Date.now()}`,
      authorId,
      content,
      createdAt: new Date().toISOString(),
    };
    setDiscussionThreads(prev => prev.map(thread => 
      thread.id === threadId 
        ? { ...thread, posts: [...thread.posts, newPost] }
        : thread
    ));
  };

  const updateCompetitionProgress = (updates: CompetitionProgressItem[]) => {
    setCompetitionProgress(updates);
  };

  const addProtocol = (protocol: Omit<Protocol, 'id'>) => {
    const newProtocol: Protocol = { ...protocol, id: `proto-${Date.now()}`};
    setProtocols(prev => [newProtocol, ...prev]);
  };

  const updateProtocol = (updatedProtocol: Protocol) => {
    setProtocols(prev => prev.map(p => p.id === updatedProtocol.id ? updatedProtocol : p));
  };

  const deleteProtocol = (protocolId: string) => {
    setProtocols(prev => prev.filter(p => p.id !== protocolId));
  };

  const getTeamMember = useCallback((userId: string) => {
    return users.find(u => u.id === userId);
  }, [users]);

  const loadData = (data: any) => {
    if (data.users) setUsers(data.users);
    if (data.tasks) setTasks(data.tasks);
    if (data.aeroResults) setAeroResults(data.aeroResults);
    if (data.finances) setFinances(data.finances);
    if (data.sponsors) setSponsors(data.sponsors);
    if (data.news) setNews(data.news);
    if (data.carHighlights) setCarHighlights(data.carHighlights);
    if (data.discussionThreads) setDiscussionThreads(data.discussionThreads);
    if (data.announcement) setAnnouncement(data.announcement);
    if (data.competitionDate) setCompetitionDate(data.competitionDate);
    if (data.competitionProgress) setCompetitionProgress(data.competitionProgress);
    if (data.protocols) setProtocols(data.protocols);
    if (data.teamLogoUrl) setTeamLogoUrl(data.teamLogoUrl);
    if (data.publicPortalContentHistory) setPublicPortalContentHistory(data.publicPortalContentHistory);
    if (data.loginHistory) setLoginHistory(data.loginHistory);
  }


  return (
    <AuthContext.Provider value={{ user, login, logout, verifyPassword, getBiometricConfig, setBiometricConfig, clearBiometricConfig }}>
      <DataContext.Provider value={{ users, setUsers, addUser, updateUser, updateUserAvatar, changePassword, tasks, addTask, updateTask, deleteTask, aeroResults, addAeroResult, updateAeroResult, finances, addFinancialRecord, deleteFinancialRecord, sponsors, addSponsor, updateSponsorStatus, deleteSponsor, news, addNewsPost, updateNewsPost, deleteNewsPost, carHighlights, addCarHighlight, updateCarHighlight, deleteCarHighlight, discussionThreads, addThread, addPostToThread, getTeamMember, loadData, competitionProgress, updateCompetitionProgress, protocols, addProtocol, updateProtocol, deleteProtocol, publicPortalContent, publicPortalContentHistory, updatePublicPortalContent, revertToVersion, loginHistory }}>
        <AppStateContext.Provider value={{ announcement, setAnnouncement, competitionDate, setCompetitionDate, teamLogoUrl, setTeamLogoUrl }}>
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