
import {
  User, Task, AeroResult, FinancialRecord, Sponsor, NewsPost, CarHighlight,
  DiscussionThread, CompetitionProgressItem, Protocol, PublicPortalContent, ContentVersion, LoginRecord, Inquiry, BackgroundTask, PunkRecordsState, Session
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
  announcement: string | null;
  competitionDate: string | null;
  teamLogoUrl: string;
  simulationRunCount: number;
  punkRecords: PunkRecordsState; 
  syncId?: string; // Track the connected cloud blob ID
  activeSessions: Session[]; // Track connected devices
}

const STORAGE_KEY = 'brh-synced-store';
const SYNC_API_URL = 'https://jsonblob.com/api/jsonBlob';

// Generate a random session ID for this tab/window
export const SESSION_ID = `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

const DEFAULT_LOGO = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIiBmaWxsPSIjMDBCRkZGIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMS4zIDEuMDQ2QTEgMSAwIDAxMTIgMnY1aDRhMSAxIDAgMDEuODIgMS41NzNsLTcgMTBBMSAxIDAgMDE4IDE4di01SDRhMSAxIDAgMDEtLjgyLTEuNTczbDctMTBhMSAxIDAgMDExLjEyLS4zOHoiIGNsaXAtcnVsZT0iZXZlbm9kZCIgLz48L3N2Zz4=';

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
        activeSessions: []
    };

    try {
        const serializedState = localStorage.getItem(STORAGE_KEY);
        if (serializedState) {
            const loadedState = JSON.parse(serializedState);
            return { ...defaultState, ...loadedState };
        }
    } catch (e) {
        console.error("Could not load state from localStorage, initializing with default.", e);
    }

    return defaultState;
};

let store: AppStore = getInitialState();
const subscribers = new Set<(store: AppStore) => void>();
let isSyncing = false;
let lastServerStateStr = "";

// --- CLOUD SYNC LOGIC ---

// 1. Initialize Sync (Check URL or create new blob)
const initializeCloudSync = async () => {
    // Check URL params for sync_id
    const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
    let syncId = urlParams.get('sync_id') || store.syncId;

    if (syncId) {
        if (syncId !== store.syncId) {
            console.log("Found Sync ID in URL, connecting...", syncId);
            store = { ...store, syncId };
            saveState(store);
            subscribers.forEach(callback => callback(store)); // Notify UI of new ID
        }
    } else {
        // Create a new blob if none exists
        try {
            const response = await fetch(SYNC_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(store)
            });
            if (response.ok) {
                const location = response.headers.get('Location');
                if (location) {
                    syncId = location.split('/').pop();
                    console.log("Created new Cloud Sync Blob:", syncId);
                    store = { ...store, syncId: syncId! };
                    saveState(store);
                    subscribers.forEach(callback => callback(store)); // Notify UI of new ID
                }
            }
        } catch (e) {
            console.warn("Offline mode: Could not create cloud sync blob.", e);
        }
    }
    
    if (store.syncId) {
        startPolling();
    }
};

// 2. Poll for updates
const startPolling = () => {
    setInterval(async () => {
        if (!store.syncId || isSyncing) return;

        try {
            const response = await fetch(`${SYNC_API_URL}/${store.syncId}`);
            if (response.ok) {
                const serverState = await response.json();
                const serverStateStr = JSON.stringify(serverState);
                
                // Only update if server has different data and we aren't currently writing
                if (serverStateStr !== lastServerStateStr && serverStateStr !== JSON.stringify(store)) {
                    // console.log("Received update from cloud.");
                    lastServerStateStr = serverStateStr;
                    store = { ...store, ...serverState }; // Merge/Overwrite
                    saveState(store);
                    subscribers.forEach(callback => callback(store));
                }
            }
        } catch (e) {
            // Silent fail on polling errors
        }
    }, 2000); // Poll every 2 seconds for near-realtime feel
};

// 3. Push updates
const pushToCloud = async (newState: AppStore) => {
    if (!newState.syncId) return;
    
    isSyncing = true;
    try {
        await fetch(`${SYNC_API_URL}/${newState.syncId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newState)
        });
        lastServerStateStr = JSON.stringify(newState);
    } catch (e) {
        console.warn("Failed to push to cloud:", e);
    } finally {
        isSyncing = false;
    }
};

// 4. Session Heartbeat
export const updateSessionHeartbeat = (user: User | null) => {
    const now = new Date().toISOString();
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    const mySession: Session = {
        id: SESSION_ID,
        userId: user ? user.id : 'guest',
        userName: user ? user.name : 'Guest Unit',
        userAgent: navigator.userAgent,
        lastActive: now,
        deviceType: isMobile ? 'mobile' : 'desktop'
    };

    // Use updateStore to ensure it syncs
    stateSyncService.updateStore((currentStore) => {
        // Filter out stale sessions (> 2 minutes old)
        const activeThreshold = new Date(Date.now() - 2 * 60 * 1000).toISOString();
        const otherSessions = (currentStore.activeSessions || []).filter(s => 
            s.id !== SESSION_ID && s.lastActive > activeThreshold
        );
        
        return {
            ...currentStore,
            activeSessions: [...otherSessions, mySession]
        };
    });
};


// --- STORAGE & EVENT LISTENERS ---

window.addEventListener('storage', (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
        try {
            const serializedState = localStorage.getItem(STORAGE_KEY);
            if (!serializedState) return;

            const newState: AppStore = JSON.parse(serializedState);
            store = newState;
            subscribers.forEach(callback => callback(store));
        } catch (e) {
            console.error("Failed to parse state from storage event:", e);
        }
    }
});

const saveState = (newState: AppStore) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  } catch (e) {
    console.error("Failed to save state to localStorage:", e);
  }
};

// Initialize Cloud Sync on module load
initializeCloudSync();

export const stateSyncService = {
  getStore: (): AppStore => store,

  subscribe: (callback: (store: AppStore) => void): () => void => {
    subscribers.add(callback);
    return () => subscribers.delete(callback);
  },

  updateStore: (updater: (currentStore: AppStore) => AppStore) => {
    const newState = updater(store);
    store = newState; 
    saveState(newState);
    pushToCloud(newState); // Trigger cloud push
    subscribers.forEach(callback => callback(store)); 
  },
};
