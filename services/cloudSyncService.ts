
import { AppStore } from './stateSyncService';

const API_BASE = 'https://jsonblob.com/api/jsonBlob';

/**
 * CloudSyncService: Connects the local state to a shared global "channel".
 */
export const cloudSyncService = {
  /**
   * Publishes the current local store to the cloud.
   * Returns the Sync ID (Blob ID) if successful.
   */
  publish: async (store: AppStore, existingSyncId?: string): Promise<string> => {
    const url = existingSyncId ? `${API_BASE}/${existingSyncId}` : API_BASE;
    const method = existingSyncId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(store),
    });

    if (!response.ok) {
      throw new Error('Cloud publication failed.');
    }

    if (method === 'POST') {
      // Extract the ID from the Location header
      const location = response.headers.get('Location');
      return location ? location.split('/').pop() || '' : '';
    }

    return existingSyncId || '';
  },

  /**
   * Fetches the latest team state from the cloud.
   */
  pull: async (syncId: string): Promise<AppStore> => {
    const response = await fetch(`${API_BASE}/${syncId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to pull from cloud. Check your Sync ID.');
    }

    return await response.json();
  }
};
