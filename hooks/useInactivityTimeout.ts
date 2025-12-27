
import { useEffect, useRef, useCallback } from 'react';

/**
 * A "Bedtime Protocol" hook.
 * It enforces a 10 PM curfew.
 * It does NOT log users out for inactivity during the day.
 * It checks specifically if the user was active right before the 10 PM logout to send a scolding message.
 * 
 * @param onLogout The function to call to log the user out.
 */
const useInactivityTimeout = (onLogout: () => void) => {
  const lastActivityRef = useRef<number>(Date.now());
  const CHECK_INTERVAL_MS = 30 * 1000; // Check time every 30 seconds

  // Update activity timestamp for "Awake Check"
  const handleActivity = useCallback(() => {
    // Throttle to 1s
    if (Date.now() - lastActivityRef.current > 1000) {
        lastActivityRef.current = Date.now();
    }
  }, []);

  useEffect(() => {
    // List of events that indicate user activity
    const activityEvents: (keyof WindowEventMap)[] = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];

    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity, { capture: true, passive: true });
    });

    // Bedtime Enforcer Interval
    const intervalId = window.setInterval(() => {
        const now = new Date();
        const hours = now.getHours();

        // 10 PM (22:00) is Bedtime.
        if (hours >= 22) {
            const timeSinceLastActive = Date.now() - lastActivityRef.current;
            // If active in last 40 seconds, they are "awake" and need scolding.
            const isAwake = timeSinceLastActive < 40000; 

            if (isAwake) {
                alert("It is 10:00 PM. Go to sleep! Nika needs rest to regain Haki.");
            }
            
            // Log them out regardless
            onLogout();
        }
    }, CHECK_INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity, { capture: true });
      });
    };
  }, [handleActivity, onLogout]);
};

export default useInactivityTimeout;
