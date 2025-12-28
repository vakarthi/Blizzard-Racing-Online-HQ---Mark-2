
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
// Statuses: OFFLINE (Init), SEARCHING (No Hub), CONNECTED (Hub Found), HUB_ACTIVE (I am Hub)
export type ExtendedSyncStatus = SyncStatus | 'SEARCHING' | 'HUB_ACTIVE';
let syncStatus: ExtendedSyncStatus = 'OFFLINE';
let syncLog: string[] = [];
let currentUserRole: UserRole | null = null; 

// Hub Heartbeat Logic
let hubHeartbeatInterval: any = null;
let hubWatchdogTimeout: any = null;
const HEARTBEAT_INTERVAL_MS = 1000;
const HUB_TIMEOUT_MS = 3000; // If no heartbeat for 3s, Hub is down

// BroadcastChannel
const meshChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);

const subscribers = new Set<(store: AppStore) => void>();
const statusSubscribers = new Set<(status: ExtendedSyncStatus) => void>();
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

const setStatus = (newStatus: ExtendedSyncStatus) => {
    if(syncStatus !== newStatus) {
        syncStatus = newStatus;
        notifyStatusSubscribers();
    }
}

const saveLocalState = (newState: AppStore) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  } catch (e) { console.error("Failed to save state:", e); }
};

// --- HUB LOGIC (The "Always-On" Module) ---

const startHubService = () => {
    if (hubHeartbeatInterval) clearInterval(hubHeartbeatInterval);
    
    setStatus('HUB_ACTIVE');
    addLog('Taking command. Initializing Central Hub Service...');
    
    // The Hub is authoritative. It loads the latest from disk and enforces it.
    // In a real app, this would pull from DB. Here, we trust LocalStorage + Memory.
    
    hubHeartbeatInterval = setInterval(() => {
        meshChannel.postMessage({ type: 'HUB_HEARTBEAT', timestamp: Date.now() });
    }, HEARTBEAT_INTERVAL_MS);
};

const stopHubService = () => {
    if (hubHeartbeatInterval) {
        clearInterval(hubHeartbeatInterval);
        hubHeartbeatInterval = null;
    }
    setStatus('SEARCHING');
};

const resetWatchdog = () => {
    if (currentUserRole === UserRole.Manager) return; // Managers don't watch themselves

    if (hubWatchdogTimeout) clearTimeout(hubWatchdogTimeout);
    
    if (syncStatus !== 'SYNCED') {
        setStatus('SYNCED'); // We found a hub!
        addLog('Connection established to Manager Hub.');
    }

    hubWatchdogTimeout = setTimeout(() => {
        setStatus('SEARCHING');
        addLog('Lost connection to Manager Hub.');
    }, HUB_TIMEOUT_MS);
};

// --- Broadcast Mesh Logic ---

meshChannel.onmessage = (event) => {
    if (!event.data) return;
    const { type, payload } = event.data;

    // 1. Heartbeat Handling
    if (type === 'HUB_HEARTBEAT') {
        resetWatchdog();
        return;
    }

    // 2. Data Sync Handling
    if (type === 'SYNC_UPDATE') {
        const remoteState = payload as AppStore;
        // Nodes blindly accept updates from the Hub (Authoritative)
        // Hubs check versions to prevent race conditions from other potential Hubs (though should only be 1)
        if (remoteState._version > store._version || currentUserRole !== UserRole.Manager) {
            store = remoteState;
            saveLocalState(store);
            notifySubscribers();
            // Only log significant version jumps to avoid spam
            if (remoteState._version - store._version > 1) {
                addLog(`Synced to Hub State v${remoteState._version}`);
            }
        }
    } 
    
    // 3. New Node Request
    else if (type === 'REQUEST_STATE') {
        if (currentUserRole === UserRole.Manager) {
            addLog('New Node requesting uplink. Transmitting state...');
            meshChannel.postMessage({ type: 'SYNC_UPDATE', payload: store });
        }
    } 
    
    // 4. Write Requests (Routed to Manager)
    else if (type === 'BOUNTY_REQUEST') {
        if (currentUserRole === UserRole.Manager) {
            // AUTHORITATIVE PROCESSING
            const { userId, amount } = payload;
            addLog(`Received Bounty Request: ${amount} for ${userId}`);
            
            const updatedUsers = store.users.map(u => 
                u.id === userId ? { ...u, bounty: (u.bounty || 0) + amount } : u
            );
            
            const newState = { ...store, users: updatedUsers };
            newState._version = (store._version || 0) + 1;
            
            store = newState;
            saveLocalState(store);
            notifySubscribers();
            
            // Broadcast the result back to everyone
            meshChannel.postMessage({ type: 'SYNC_UPDATE', payload: store });
        }
    }
};

const initialize = () => {
    // Default state: Searching for a Hub
    setStatus('SEARCHING');
    
    // Ask if anyone is out there
    setTimeout(() => {
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
      const prevRole = currentUserRole;
      currentUserRole = role;
      
      if (role === UserRole.Manager) {
          if (prevRole !== UserRole.Manager) startHubService();
      } else {
          if (prevRole === UserRole.Manager) stopHubService();
      }
  },

  subscribe: (callback: (store: AppStore) => void): () => void => {
    subscribers.add(callback);
    return () => subscribers.delete(callback);
  },
  
  subscribeToStatus: (callback: (status: ExtendedSyncStatus) => void): () => void => {
      statusSubscribers.add(callback);
      callback(syncStatus);
      return () => statusSubscribers.delete(callback);
  },
  
  subscribeToLog: (callback: (log: string[]) => void): () => void => {
      logSubscribers.add(callback);
      callback(syncLog);
      return () => logSubscribers.delete(callback);
  },

  // General Update (Local Only or Manager Broadcast)
  updateStore: (updater: (currentStore: AppStore) => AppStore, updatedBy?: {userId: string, userName: string}) => {
    const newState = updater(store);
    newState._version = (store._version || 0) + 1;
    if (updatedBy) newState._lastUpdatedBy = updatedBy;

    store = newState; 
    saveLocalState(newState);
    notifySubscribers(); 
    
    // Anyone can broadcast generic updates (e.g. chat), but Hub enforces structure
    meshChannel.postMessage({ type: 'SYNC_UPDATE', payload: newState });
  },
  
  // Specific Hub-Routed Action
  requestBountyUpdate: (userId: string, amount: number) => {
      if (currentUserRole === UserRole.Manager) {
          // I am the Hub, execute immediately
          stateSyncService.updateStore(s => ({
              ...s,
              users: s.users.map(u => u.id === userId ? { ...u, bounty: (u.bounty || 0) + amount } : u)
          }));
          addLog(`Hub: Applied bounty +${amount} locally.`);
      } else {
          if (syncStatus !== 'SYNCED') {
              addLog('Error: Cannot transmit bounty. Hub Offline.');
              return;
          }
          // I am a Node, transmit request
          meshChannel.postMessage({ type: 'BOUNTY_REQUEST', payload: { userId, amount } });
          addLog(`Transmitted bounty request (+${amount}) to Hub.`);
      }
  },
  
  initialize
};

// Initialize on load
stateSyncService.initialize();
