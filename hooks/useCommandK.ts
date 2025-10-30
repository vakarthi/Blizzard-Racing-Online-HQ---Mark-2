import { useEffect, useCallback } from 'react';

export const useCommandK = (callback: () => void) => {
  const memoizedCallback = useCallback(callback, [callback]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        memoizedCallback();
      }
    };

    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [memoizedCallback]);
};
