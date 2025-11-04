import { useEffect, useRef, useCallback } from 'react';

/**
 * A custom hook that triggers a callback function after a period of user inactivity.
 * @param onTimeout The function to call when the user is inactive.
 * @param timeout The inactivity duration in milliseconds.
 */
const useInactivityTimeout = (onTimeout: () => void, timeout: number) => {
  const timeoutId = useRef<number | null>(null);

  // Memoize the reset function to prevent re-creation on every render
  const resetTimer = useCallback(() => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    timeoutId.current = window.setTimeout(onTimeout, timeout);
  }, [onTimeout, timeout]);

  // Memoize the activity handler
  const handleActivity = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    // List of events that indicate user activity
    const activityEvents: (keyof WindowEventMap)[] = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];

    // Set up event listeners for all activity events
    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity, { capture: true, passive: true });
    });

    // Start the initial timer when the hook mounts
    resetTimer();

    // Cleanup function to remove event listeners and clear the timer
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity, { capture: true });
      });
    };
  }, [resetTimer, handleActivity]); // Rerun effect if the callbacks change
};

export default useInactivityTimeout;
