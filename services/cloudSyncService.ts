
import { AppStore } from './stateSyncService';

const API_BASE = 'https://jsonblob.com/api/jsonBlob';
let consecutiveFailures = 0;
const MAX_FAILURES_BEFORE_SILENCE = 3;

/**
 * CloudSyncService: Refined to handle network blocks silently.
 * If the network (school firewall) blocks the endpoint, it will stop retrying loudly 
 * after a few attempts to keep the dev console clean.
 */
export const cloudSyncService = {
  publish: async (store: AppStore, existingSyncId?: string): Promise<string> => {
    // If we've failed too many times, assume we're behind a firewall and stop trying
    if (consecutiveFailures > MAX_FAILURES_BEFORE_SILENCE) return existingSyncId || '';

    const url = existingSyncId ? `${API_BASE}/${existingSyncId}` : API_BASE;
    const method = existingSyncId ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
          method,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(store),
        });

        if (!response.ok) throw new Error();
        
        consecutiveFailures = 0; // Reset on success

        if (method === 'POST') {
          const location = response.headers.get('Location');
          return location ? location.split('/').pop() || '' : '';
        }

        return existingSyncId || '';
    } catch (error) {
        consecutiveFailures++;
        return existingSyncId || '';
    }
  },

  pull: async (syncId: string): Promise<AppStore> => {
    if (consecutiveFailures > MAX_FAILURES_BEFORE_SILENCE) {
        throw new Error("SILENT_MODE");
    }

    try {
        const response = await fetch(`${API_BASE}/${syncId}`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          cache: 'no-store'
        });

        if (!response.ok) throw new Error();
        
        consecutiveFailures = 0;
        return await response.json();
    } catch (error) {
        consecutiveFailures++;
        throw error; 
    }
  }
};
