
import {
  User, Task, AeroResult, FinancialRecord, Sponsor, NewsPost, CarHighlight,
  DiscussionThread, CompetitionProgressItem, Protocol, PublicPortalContent, ContentVersion, LoginRecord, Inquiry
} from '../types';
import {
  MOCK_USERS, MOCK_TASKS, MOCK_FINANCES, MOCK_SPONSORS, MOCK_NEWS, MOCK_CAR_HIGHLIGHTS,
  MOCK_THREADS, MOCK_COMPETITION_PROGRESS, MOCK_PROTOCOLS, INITIAL_PUBLIC_PORTAL_CONTENT
} from './mockData';

// This is the shape of our global, synchronized store.
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
  announcement: string | null;
  competitionDate: string | null;
  teamLogoUrl: string;
}

const STORAGE_KEY = 'brh-synced-store';

const DEFAULT_LOGO = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIiBmaWxsPSIjMDBCRkZGIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMS4zIDEuMDQ2QTEgMSAwIDAxMTIgMnY1aDRhMSAxIDAgMDEuODIgMS41NzNsLTcgMTBBMSAxIDAgMDE4IDE4di01SDRhMSAxIDAgMDEtLjgyLTEuNTczbDctMTBhMSAxIDAgMDExLjEyLS4zOHoiIGNsaXAtcnVsZT0iZXZlbm9kZCIgLz48L3N2Zz4=';

const getInitialState = (): AppStore => {
    try {
        const serializedState = localStorage.getItem(STORAGE_KEY);
        if (serializedState) return JSON.parse(serializedState);
    } catch (e) {
        console.error("Could not load state from localStorage, initializing with default.", e);
    }

    // If nothing in storage or parsing fails, create initial state
    return {
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
        announcement: 'Welcome to the Blizzard Racing HQ! All systems are operational.',
        competitionDate: '2024-12-01T09:00:00',
        teamLogoUrl: DEFAULT_LOGO,
    };
};

let store: AppStore = getInitialState();
const subscribers = new Set<(store: AppStore) => void>();

// New: Listener for storage events from other tabs.
// This is more robust than BroadcastChannel for ensuring state sync.
window.addEventListener('storage', (event: StorageEvent) => {
    // Check if the change happened to our specific storage key and has a new value.
    if (event.key === STORAGE_KEY && event.newValue) {
        try {
            const newState: AppStore = JSON.parse(event.newValue);
            // Update the in-memory store and notify subscribers only if the state has actually changed.
            // This prevents potential re-render loops.
            if (JSON.stringify(store) !== JSON.stringify(newState)) {
                store = newState;
                subscribers.forEach(callback => callback(store));
            }
        } catch (e) {
            console.error("Failed to parse state from storage event:", e);
        }
    }
});

// Simplified function to save state, which implicitly triggers the sync event.
const saveState = (newState: AppStore) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  } catch (e) {
    console.error("Failed to save state to localStorage:", e);
  }
};

export const stateSyncService = {
  getStore: (): AppStore => store,

  subscribe: (callback: (store: AppStore) => void): () => void => {
    subscribers.add(callback);
    return () => subscribers.delete(callback);
  },

  updateStore: (updater: (currentStore: AppStore) => AppStore) => {
    const newState = updater(store);
    store = newState; // 1. Update the local, in-memory store for the current tab.
    saveState(newState); // 2. Persist to localStorage, which triggers the 'storage' event for all other tabs.
    subscribers.forEach(callback => callback(store)); // 3. Notify local subscribers in the current tab to trigger UI updates.
  },
};
