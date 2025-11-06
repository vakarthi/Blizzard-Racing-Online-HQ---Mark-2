import {
  User, Task, AeroResult, FinancialRecord, Sponsor, NewsPost, CarHighlight,
  DiscussionThread, CompetitionProgressItem, Protocol, PublicPortalContent, ContentVersion, LoginRecord
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
  announcement: string | null;
  competitionDate: string | null;
  teamLogoUrl: string;
}

const STORAGE_KEY = 'brh-synced-store';
const SYNC_CHANNEL_NAME = 'brh-sync-channel';

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
        announcement: 'Welcome to the Blizzard Racing HQ! All systems are operational.',
        competitionDate: '2024-12-01T09:00:00',
        teamLogoUrl: DEFAULT_LOGO,
    };
};

let store: AppStore = getInitialState();
const subscribers = new Set<(store: AppStore) => void>();
const channel = new BroadcastChannel(SYNC_CHANNEL_NAME);

// When another tab sends a message, update our store and notify components
channel.onmessage = (event: MessageEvent<AppStore>) => {
  store = event.data;
  // Also update our own localStorage to be in sync
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  subscribers.forEach(callback => callback(store));
};

const saveAndBroadcast = (newState: AppStore) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    // The message is posted, and the onmessage handler in other tabs will pick it up.
    channel.postMessage(newState);
  } catch (e) {
    console.error("Failed to save state or broadcast:", e);
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
    store = newState;
    saveAndBroadcast(newState);
    subscribers.forEach(callback => callback(store));
  },
};