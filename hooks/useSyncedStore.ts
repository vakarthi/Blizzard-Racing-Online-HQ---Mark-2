
import { useSyncExternalStore } from 'react';
import { stateSyncService, AppStore } from '../services/stateSyncService';

/**
 * A hook that provides real-time, synchronized access to the global app store.
 * It uses React 18's useSyncExternalStore for a robust subscription to an external store.
 * This ensures there are no tearing issues during concurrent rendering.
 *
 * @returns A tuple containing the current store state and a dispatcher function.
 * The dispatcher function takes an updater function to modify the store.
 */
export const useSyncedStore = (): [AppStore, (updater: (currentStore: AppStore) => AppStore) => void] => {
  const store = useSyncExternalStore(
    stateSyncService.subscribe,
    stateSyncService.getStore
  );

  return [store, stateSyncService.updateStore];
};
