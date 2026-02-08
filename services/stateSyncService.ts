
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

// Unique ID for this specific tab/window instance
const INSTANCE_ID = `NODE-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

let store: AppStore;
let syncStatus: SyncStatus = 'OFFLINE';
let syncLog: string[] = [];
let currentUserRole: UserRole | null = null; 

// Hub Logic State
let hubHeartbeatInterval: any = null;
let hubBroadcastInterval: any = null;
let hubWatchdogTimeout: any = null;
let currentHubSessionId: string | null = null;

const HEARTBEAT_INTERVAL_MS = 1000; 
const BROADCAST_INTERVAL_MS = 2000; 
const HUB_TIMEOUT_MS = 4000; 

// BroadcastChannel
const meshChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);

const subscribers = new Set<(store: AppStore) => void>();
const statusSubscribers = new Set<(status: SyncStatus) => void>();
const logSubscribers = new Set<(log: string[]) => void>();

// Stylized Eagle Logo (SVG Data URI)
const DEFAULT_LOGO = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBmaWxsPSJub25lIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZDEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMDBGMEZGO3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMyNTYzRUI7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8Y2lyY2xlIGN4PSIyNTYiIGN5PSIyNTYiIHI9IjI0MCIgZmlsbD0iIzAyMDYxNyIHN0cm9rZT0idXJsKCNncmFkMSkiIHN0cm9rZS13aWR0aD0iMTUiLz4KICA8cGF0aCBkPSJNMTI4IDE5MiBDIDE2MCAxMjAgMzUwIDEyMCAzODQgMTkyIEMgNDIwIDI2MCA0MjAgMzQwIDI1NiA0NDggQyA5MiAzNDAgOTIgMjYwIDEyOCAxOTIgWiIgZmlsbD0iIzFFMjkzQiIgc3Ryb2tlPSJ1cmwoI2dyYWQxKSIgc3Ryb2tlLXdpZHRoPSI1Ii8+CiAgPHBhdGggZD0iTTI1NiAxNjAgTCAzMjAgMjQwIEwgMTkyIDI0MCBaIiBmaWxsPSJ1cmwoI2dyYWQxKSIvPgogIDxwYXRoIGQ9Ik0xNjAgMjYwIEwgMjEwIDI4MCBMIDI1NiAzNTAgTCAzMDAgMjgwIEwgMzUwIDI2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPg==';

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
        competitionDate: '2026-03-24T09:00:00', // Updated: Tuesday, March 24, 2026
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
    // Deduplicate repetitive logs
    if (syncLog.length > 0 && syncLog[0].includes(message) && message.includes('Heartbeat')) {
        return; 
    }
    syncLog = [`[${new Date().toLocaleTimeString()}] ${message}`, ...syncLog].slice(0, 50);
    notifyLogSubscribers();
}

const setStatus = (newStatus: SyncStatus) => {
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
    if (hubBroadcastInterval) clearInterval(hubBroadcastInterval);
    
    // Generate a unique session ID for this Hub instance
    // This allows nodes to detect if the Hub restarted
    currentHubSessionId = `HUB-${INSTANCE_ID}-${Date.now()}`;
    
    setStatus('HUB_ACTIVE');
    addLog(`Initializing Hub Session: ${currentHubSessionId}`);
    
    // 1. Heartbeat - Lightweight "I am here"
    hubHeartbeatInterval = setInterval(() => {
        meshChannel.postMessage({ 
            type: 'HUB_HEARTBEAT', 
            timestamp: Date.now(), 
            hubId: currentHubSessionId 
        });
    }, HEARTBEAT_INTERVAL_MS);

    // 2. Broadcast - Heavyweight "Here is the data" (Aggressive Sync)
    hubBroadcastInterval = setInterval(() => {
        meshChannel.postMessage({ 
            type: 'SYNC_UPDATE', 
            payload: store, 
            hubId: currentHubSessionId,
            isPeriodic: true 
        });
    }, BROADCAST_INTERVAL_MS);

    // Initial announce
    meshChannel.postMessage({ type: 'HUB_HEARTBEAT', timestamp: Date.now(), hubId: currentHubSessionId });
    meshChannel.postMessage({ type: 'SYNC_UPDATE', payload: store, hubId: currentHubSessionId, isPeriodic: true });
};

const stopHubService = () => {
    if (hubHeartbeatInterval) clearInterval(hubHeartbeatInterval);
    if (hubBroadcastInterval) clearInterval(hubBroadcastInterval);
    hubHeartbeatInterval = null;
    hubBroadcastInterval = null;
    currentHubSessionId = null;
    
    setStatus('SEARCHING');
};

const resetWatchdog = (receivedHubId: string) => {
    if (currentUserRole === UserRole.Manager) return;

    if (hubWatchdogTimeout) clearTimeout(hubWatchdogTimeout);
    
    if (syncStatus !== 'SYNCED') {
        setStatus('SYNCED'); 
        addLog(`Connected to Manager: ${receivedHubId}`);
        // If we just connected, ask for state
        meshChannel.postMessage({ type: 'REQUEST_STATE', senderId: INSTANCE_ID });
    }

    hubWatchdogTimeout = setTimeout(() => {
        setStatus('SEARCHING');
        addLog('Manager signal lost. Scanning...');
    }, HUB_TIMEOUT_MS);
};

// --- Broadcast Mesh Logic ---

meshChannel.addEventListener('message', (event) => {
    if (!event.data) return;
    const { type, payload, hubId } = event.data;

    // 1. Heartbeat Handling
    if (type === 'HUB_HEARTBEAT') {
        resetWatchdog(hubId || 'UNKNOWN');
        return;
    }

    // 2. Data Sync Handling
    if (type === 'SYNC_UPDATE') {
        if (currentUserRole === UserRole.Manager) return;

        const remoteState = payload as AppStore;
        
        // Always trust the Hub's version of truth if we are a node
        // Simple version check to avoid jitter
        if (remoteState._version >= store._version) {
            store = remoteState;
            saveLocalState(store);
            notifySubscribers();
            // Reset watchdog here too, as a data packet implies a hub is present
            resetWatchdog(hubId || 'UNKNOWN');
        }
    } 
    
    // 3. New Node Request
    else if (type === 'REQUEST_STATE') {
        // Only the Manager responds to state requests
        if (currentUserRole === UserRole.Manager) {
            meshChannel.postMessage({ 
                type: 'SYNC_UPDATE', 
                payload: store,
                hubId: currentHubSessionId 
            });
        }
    } 
    
    // 4. Write Requests (Routed to Manager)
    else if (type === 'BOUNTY_REQUEST') {
        if (currentUserRole === UserRole.Manager) {
            const { userId, amount } = payload;
            
            const updatedUsers = store.users.map(u => 
                u.id === userId ? { ...u, bounty: (u.bounty || 0) + amount } : u
            );
            
            const newState = { ...store, users: updatedUsers };
            newState._version = (store._version || 0) + 1;
            
            store = newState;
            saveLocalState(store);
            notifySubscribers();
            
            // Broadcast immediately
            meshChannel.postMessage({ 
                type: 'SYNC_UPDATE', 
                payload: store,
                hubId: currentHubSessionId 
            });
        }
    }
});

const initialize = () => {
    // Default state: Searching for a Hub
    setStatus('SEARCHING');
    addLog(`Node Started: ${INSTANCE_ID}`);
    
    // Ping to see if anyone is there
    setTimeout(() => {
        meshChannel.postMessage({ type: 'REQUEST_STATE', senderId: INSTANCE_ID });
    }, 500);
};

// --- Service Interface ---

export const stateSyncService = {
  getStore: (): AppStore => store,
  getSyncStatus: () => syncStatus,
  getSyncLog: () => syncLog,
  getSyncId: () => INSTANCE_ID,

  setRole: (role: UserRole | null) => {
      const prevRole = currentUserRole;
      currentUserRole = role;
      
      // If switching TO manager
      if (role === UserRole.Manager && prevRole !== UserRole.Manager) {
          startHubService();
      } 
      // If switching FROM manager
      else if (role !== UserRole.Manager && prevRole === UserRole.Manager) {
          stopHubService();
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

  // General Update (Local Only or Manager Broadcast)
  updateStore: (updater: (currentStore: AppStore) => AppStore, updatedBy?: {userId: string, userName: string}) => {
    const newState = updater(store);
    newState._version = (store._version || 0) + 1;
    if (updatedBy) newState._lastUpdatedBy = updatedBy;

    store = newState; 
    saveLocalState(newState);
    notifySubscribers(); 
    
    // Broadcast change
    meshChannel.postMessage({ 
        type: 'SYNC_UPDATE', 
        payload: newState,
        hubId: currentHubSessionId || 'LOCAL_UPDATE' 
    });
  },
  
  // Specific Hub-Routed Action
  requestBountyUpdate: (userId: string, amount: number) => {
      if (currentUserRole === UserRole.Manager) {
          // I am the Hub, execute immediately
          stateSyncService.updateStore(s => ({
              ...s,
              users: s.users.map(u => u.id === userId ? { ...u, bounty: (u.bounty || 0) + amount } : u)
          }));
      } else {
          // I am a Node, transmit request
          meshChannel.postMessage({ type: 'BOUNTY_REQUEST', payload: { userId, amount }, senderId: INSTANCE_ID });
      }
  },
  
  initialize
};

// Initialize on load
stateSyncService.initialize();
