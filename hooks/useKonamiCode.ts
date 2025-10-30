import { useState, useEffect, useCallback, useRef } from 'react';

export const useKonamiCode = (callback: () => void, code: string[]): number => {
  const [matchedCount, setMatchedCount] = useState(0);
  const codeRef = useRef(code);
  codeRef.current = code;
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const handler = useCallback((e: KeyboardEvent) => {
    const { key } = e;
    const currentCode = codeRef.current;
    
    setMatchedCount(prevMatchedCount => {
        if (key === currentCode[prevMatchedCount]) {
            const newCount = prevMatchedCount + 1;
            if (newCount === currentCode.length) {
                callbackRef.current();
                return 0; // Reset after successful code
            }
            return newCount;
        }
        // Reset if key is wrong, but check if it's the start of a new sequence
        if (key === currentCode[0]) {
            return 1;
        }
        return 0;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [handler]);

  return matchedCount;
};