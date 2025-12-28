
import {
  User, Task, AeroResult, FinancialRecord, Sponsor, NewsPost, CarHighlight,
  DiscussionThread, CompetitionProgressItem, Protocol, PublicPortalContent, ContentVersion, LoginRecord, Inquiry, BackgroundTask, PunkRecordsState, Session, SyncStatus, UserRole
} from '../types';
import {
  MOCK_USERS, MOCK_TASKS, MOCK_FINANCES, MOCK_SPONSORS, MOCK_NEWS, MOCK_CAR_HIGHLIGHTS,
  MOCK_THREADS, MOCK_COMPETITION_PROGRESS, MOCK_PROTOCOLS, INITIAL_PUBLIC_PORTAL_CONTENT
} from './mockData';

// --- Types ---
export interface AppStore {
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
  publicPortalContentHistory: ContentVersion[];
  loginHistory: LoginRecord[];
  inquiries: Inquiry[];
  backgroundTasks: BackgroundTask[];
  activeSessions: Session[];
  announcement: string | null;
  competitionDate: string | null;
  teamLogoUrl: string;
  simulationRunCount: number;
  punkRecords: PunkRecordsState; 
  _version: number;
  _lastUpdatedBy: { userId: string, userName: string } | null;
}

const STORAGE_KEY = 'brh-local-store';
const BROADCAST_CHANNEL_NAME = 'punk_records_mesh_network';

let store: AppStore;
let syncStatus: SyncStatus = 'OFFLINE';
let syncLog: string[] = [];
let currentUserRole: UserRole | null = null; // Track role for Hub logic

// BroadcastChannel allows simple communication between browsing contexts (tabs, windows, iframes) with the same origin.
const meshChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);

const subscribers = new Set<(store: AppStore) => void>();
const statusSubscribers = new Set<(status: SyncStatus) => void>();
const logSubscribers = new Set<(log: string[]) => void>();

const DEFAULT_LOGO = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZHRoPSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIiBmaWxsPSIjMDBCRkZGIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMS4zIDEuMDQ2QTEgMSAwIDAxMTIgMnY1aDRhMSAxIDAgMDEuODIgMS41NzNsLTcgMTBhMSAxIDAgMDE4IDE4di01SDRhMSAxIDAgMDEtLjgyLTEuNTczbDctMTBhMSAxIDAgMDExLjEyLS4zOHoiIGNsaXAtcnVsZT0iZXZlbm9kZCIgLz48L3N2Zz4=';

const getInitialState = (): AppStore => {
    const defaultState: AppStore = {
        users: MOCK_USERS,
        tasks: MOCK_TASKS,
        aeroResults: [],
        finances: MOCK_FINANCES,
        sponsors: MOCK_SPONSORS,
        news: MOCK_NEWS,
        carHighlights: MOCK_CAR_HIGHLIGHTS,
        discussionThreads: MOCK_THREADS,
        competitionProgress: MOCK_COMPETITION_PROGRESS,
        protocols: MOCK_PROTOCOLS,
        publicPortalContentHistory: [{
            content: INITIAL_PUBLIC_PORTAL_CONTENT,
            timestamp: new Date().toISOString(),
            editorId: 'system'
        }],
        loginHistory: [],
        inquiries: [],
        backgroundTasks: [],
        activeSessions: [],
        announcement: 'Welcome to the Blizzard Racing HQ! All systems are operational.',
        competitionDate: '2024-12-01T09:00:00',
        teamLogoUrl: DEFAULT_LOGO,
        simulationRunCount: 0,
        punkRecords: {
            syncRate: 0,
            solverGeneration: 1,
            generationName: 'Saturn',
            formulasSynthesized: 0,
            currentMasterFormula: 'F_d = \\int (\\rho v^2) + \\nabla \\cdot \\sigma + \\sum_{i=0}^{\\infty} \\epsilon_i',
            complexityScore: 100, 
            accuracyRating: 60.0 
        },
        _version: 1, 
        _lastUpdatedBy: null,
    };

    try {
        const serializedState = localStorage.getItem(STORAGE_KEY);
        if (serializedState) {
            let loadedState = JSON.parse(serializedState);
            // Migration check
            if (!loadedState._version || loadedState._version < 1) {
                loadedState._version = 1;
            }
            return { ...defaultState, ...loadedState };
        }
    } catch (e) {
        console.error("Failed to load state:", e);
    }
    return defaultState;
};

// --- Service Setup ---
store = getInitialState();

const notifySubscribers = () => subscribers.forEach(cb => cb(store));
const notifyStatusSubscribers = () => statusSubscribers.forEach(cb => cb(syncStatus));
const notifyLogSubscribers = () => logSubscribers.forEach(cb => cb(syncLog));

const addLog = (message: string) => {
    syncLog = [`[${new Date().toLocaleTimeString()}] ${message}`, ...syncLog].slice(0, 50);
    notifyLogSubscribers();
}

const setStatus = (newStatus: SyncStatus) => {
    if(syncStatus !== newStatus) {
        syncStatus = newStatus;
        addLog(`Mesh Network Status: ${newStatus}`);
        notifyStatusSubscribers();
    }
}

const saveLocalState = (newState: AppStore) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  } catch (e) { console.error("Failed to save state:", e); }
};

// --- Broadcast Mesh Logic ---

meshChannel.onmessage = (event) => {
    if (!event.data) return;

    if (event.data.type === 'SYNC_UPDATE') {
        const remoteState = event.data.payload as AppStore;
        
        // Conflict Resolution Strategy: Highest Version Wins (LWW - Last Write Wins)
        if (remoteState._version > store._version) {
            store = remoteState;
            saveLocalState(store);
            notifySubscribers();
            addLog(`Received update v${remoteState._version} from Mesh.`);
        } else if (remoteState._version < store._version) {
            // We have a newer version, broadcast it back to correct the sender
            addLog(`Mesh peer has older version (v${remoteState._version}). Broadcasting v${store._version}.`);
            meshChannel.postMessage({ type: 'SYNC_UPDATE', payload: store });
        }
    } else if (event.data.type === 'REQUEST_STATE') {
        // A new tab opened and wants the current state
        addLog('New Satellite requested state. Broadcasting...');
        meshChannel.postMessage({ type: 'SYNC_UPDATE', payload: store });
    } else if (event.data.type === 'BOUNTY_UPDATE') {
        // MANAGER HUB LOGIC
        // If this instance is the Manager, authorize the bounty update and broadcast new state
        if (currentUserRole === UserRole.Manager) {
            const { userId, amount } = event.data.payload;
            
            const updatedUsers = store.users.map(u => 
                u.id === userId ? { ...u, bounty: (u.bounty || 0) + amount } : u
            );
            
            const newState = { ...store, users: updatedUsers };
            newState._version = (store._version || 0) + 1;
            
            store = newState;
            saveLocalState(store);
            notifySubscribers();
            
            // Push authoritative update to all nodes
            meshChannel.postMessage({ type: 'SYNC_UPDATE', payload: store });
            addLog(`Manager authorized bounty +${amount} for ${userId}`);
        }
    }
};

const broadcastUpdate = (newState: AppStore) => {
    meshChannel.postMessage({ type: 'SYNC_UPDATE', payload: newState });
    setStatus('SYNCED');
};

const initialize = () => {
    setStatus('CONNECTING');
    
    // Simulate initial connection handshake
    setTimeout(() => {
        setStatus('SYNCED');
        addLog('Connected to Punk Records Mesh Network.');
        
        // Ask for latest state from network on startup (in case other tabs have newer data)
        meshChannel.postMessage({ type: 'REQUEST_STATE' });
    }, 500);
};

// --- Service Interface ---

export const stateSyncService = {
  getStore: (): AppStore => store,
  getSyncStatus: () => syncStatus,
  getSyncLog: () => syncLog,
  getSyncId: () => 'LOCAL-MESH-NET',

  setRole: (role: UserRole | null) => {
      if (currentUserRole !== role) {
          currentUserRole = role;
          if (role === UserRole.Manager) {
              addLog("Authenticated as Manager. Hub Mode Active.");
          }
      }
  },

  subscribe: (callback: (store: AppStore) => void): () => void => {
    subscribers.add(callback);
    return () => subscribers.delete(callback);
  },
  
  subscribeToStatus: (callback: (status: SyncStatus) => void): () => void => {
      statusSubscribers.add(callback);
      callback(syncStatus);
      return () => statusSubscribers.delete(callback);
  },
  
  subscribeToLog: (callback: (log: string[]) => void): () => void => {
      logSubscribers.add(callback);
      callback(syncLog);
      return () => logSubscribers.delete(callback);
  },

  updateStore: (updater: (currentStore: AppStore) => AppStore, updatedBy?: {userId: string, userName: string}) => {
    const newState = updater(store);
    
    // Version increment for conflict resolution
    newState._version = (store._version || 0) + 1;
    if (updatedBy) {
        newState._lastUpdatedBy = updatedBy;
    }

    store = newState; 
    saveLocalState(newState);
    notifySubscribers(); 
    
    // Broadcast change to other tabs/windows immediately
    broadcastUpdate(newState);
  },
  
  requestBountyUpdate: (userId: string, amount: number) => {
      if (currentUserRole === UserRole.Manager) {
          // I am the Manager (Hub), apply directly
          stateSyncService.updateStore(s => ({
              ...s,
              users: s.users.map(u => u.id === userId ? { ...u, bounty: (u.bounty || 0) + amount } : u)
          }));
          addLog(`Manager applied bounty +${amount}`);
      } else {
          // I am a Node, transmit to Manager
          meshChannel.postMessage({ type: 'BOUNTY_UPDATE', payload: { userId, amount } });
          // Optimistic local update for UI responsiveness (optional, but good UX)
          // Ideally we wait for sync, but for bouncy numbers, immediate feedback is better.
          // However, strict hub architecture implies we wait. Let's send only.
          // But to prevent UI lag in this demo, we'll optimistically update store but NOT broadcast generic SYNC_UPDATE
          // Actually, let's trust the mesh speed (it's fast).
      }
  },
  
  initialize
};

// Initialize on load
stateSyncService.initialize();
