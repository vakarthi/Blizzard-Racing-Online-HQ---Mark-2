
import {
  User, Task, AeroResult, FinancialRecord, Sponsor, NewsPost, CarHighlight,
  DiscussionThread, CompetitionProgressItem, Protocol, PublicPortalContent, ContentVersion, LoginRecord, Inquiry, BackgroundTask, PunkRecordsState, Session, SyncStatus
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
// The Sync ID is now a hardcoded constant for the entire application.
const syncId: string = 'PONEGLYPH-BLIZZARD-HQ-MARK2';

let store: AppStore;
let syncStatus: SyncStatus = 'OFFLINE';
let syncLog: string[] = [];
let pollingInterval: number | null = null;
let isPushing = false; // A lock to prevent concurrent pushes

const subscribers = new Set<(store: AppStore) => void>();
const statusSubscribers = new Set<(status: SyncStatus) => void>();
const logSubscribers = new Set<(log: string[]) => void>();

const API_BASE = 'https://jsonblob.com/api/jsonBlob';

const DEFAULT_LOGO = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZHRoPSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIiBmaWxsPSIjMDBCRkZGIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMS4zIDEuMDQ2QTEgMSAwIDAxMTIgMnY1aDRhMSAxIDAgMDEuODIgMS41NzNsLTcgMTBBMSAxIDAgMDE4IDE4di01SDRhMSAxIDAgMDEtLjgyLTEuNTczbDctMTBhMSAxIDAgMDExLjEyLS4zOHoiIGNsaXAtcnVsZT0iZXZlbm9kZCIgLz48L3N2Zz4=';

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
        _version: 0,
        _lastUpdatedBy: null,
    };

    try {
        const serializedState = localStorage.getItem(STORAGE_KEY);
        if (serializedState) {
            return { ...defaultState, ...JSON.parse(serializedState) };
        }
    } catch (e) {
        console.error("Could not load state from localStorage, initializing with default.", e);
    }
    return defaultState;
};

// --- Service Setup ---
store = getInitialState();

const notifySubscribers = () => subscribers.forEach(cb => cb(store));
const notifyStatusSubscribers = () => statusSubscribers.forEach(cb => cb(syncStatus));
const notifyLogSubscribers = () => logSubscribers.forEach(cb => cb(syncLog));

const addLog = (message: string) => {
    syncLog = [`[${new Date().toLocaleTimeString()}] ${message}`, ...syncLog].slice(0, 20);
    notifyLogSubscribers();
}

const setStatus = (newStatus: SyncStatus) => {
    if(syncStatus !== newStatus) {
        syncStatus = newStatus;
        addLog(`Status changed to ${newStatus}`);
        notifyStatusSubscribers();
    }
}

const saveLocalState = (newState: AppStore) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  } catch (e) { console.error("Failed to save state to localStorage:", e); }
};

// --- Core Sync Logic ---

const _fetchRemoteState = async (): Promise<AppStore | null> => {
    if (!syncId) return null;
    try {
        const res = await fetch(`${API_BASE}/${syncId}`);
        if (!res.ok) throw new Error(`Network response was not ok: ${res.statusText}`);
        return await res.json();
    } catch (e) {
        console.error("Fetch failed:", e);
        setStatus('ERROR');
        return null;
    }
};

const _pushStateToCloud = async (stateToPush: AppStore) => {
    if (!syncId || isPushing) return;
    isPushing = true;
    
    try {
        const remoteState = await _fetchRemoteState();
        if (remoteState && remoteState._version > stateToPush._version - 1) {
            addLog(`Conflict detected. Remote version (${remoteState._version}) > Local version (${stateToPush._version - 1}). Overwriting local.`);
            store = remoteState;
            saveLocalState(store);
            notifySubscribers();
            setStatus('CONFLICT');
            setTimeout(() => setStatus('SYNCED'), 2000);
            isPushing = false;
            return;
        }

        const res = await fetch(`${API_BASE}/${syncId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'X-jsonblob': syncId },
            body: JSON.stringify(stateToPush),
        });

        if (!res.ok) throw new Error(`Network response was not ok: ${res.statusText}`);
        addLog(`Successfully pushed version ${stateToPush._version}.`);
        setStatus('SYNCED');

    } catch (e) {
        console.error("Push failed:", e);
        setStatus('ERROR');
    } finally {
        isPushing = false;
    }
};

const pollForChanges = async () => {
    const remoteState = await _fetchRemoteState();
    if (remoteState && remoteState._version > store._version) {
        addLog(`Pulled remote version ${remoteState._version}. Overwriting local version ${store._version}.`);
        store = remoteState;
        saveLocalState(store);
        notifySubscribers();
        setStatus('SYNCED');
    }
};

const startSyncing = async () => {
    if (pollingInterval) clearInterval(pollingInterval);
    setStatus('CONNECTING');
    
    const remoteState = await _fetchRemoteState();
    if (remoteState) {
        if (remoteState._version > store._version) {
            store = remoteState;
        } else if (remoteState._version < store._version) {
            await _pushStateToCloud(store);
        }
        setStatus('SYNCED');
    } else {
        await _pushStateToCloud(store);
    }
    
    saveLocalState(store);
    notifySubscribers();

    pollingInterval = window.setInterval(pollForChanges, 10000);
};


// --- Service Interface ---

export const stateSyncService = {
  getStore: (): AppStore => store,
  getSyncStatus: () => syncStatus,
  getSyncLog: () => syncLog,
  getSyncId: () => syncId,

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
    
    newState._version = (store._version || 0) + 1;
    if (updatedBy) {
        newState._lastUpdatedBy = updatedBy;
    }

    store = newState; 
    saveLocalState(newState);
    notifySubscribers(); 
    
    _pushStateToCloud(newState);
  },
  
  initialize: () => {
      startSyncing();
  }
};

// Always initialize sync on load.
stateSyncService.initialize();
