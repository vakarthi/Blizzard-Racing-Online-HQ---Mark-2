
import { useEffect, useRef } from 'react';

export const useKonamiCode = (action: () => void) => {
  // Use refs to keep track of input and action without triggering re-renders or effect re-runs
  const inputRef = useRef<string[]>([]);
  const actionRef = useRef(action);

  // Update the action ref whenever the passed action changes
  useEffect(() => {
    actionRef.current = action;
  }, [action]);

  useEffect(() => {
    const sequence = [
      'ArrowUp',
      'ArrowUp',
      'ArrowDown',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'ArrowLeft',
      'ArrowRight',
      'b',
      'a',
    ];

    const handleKeyDown = (e: KeyboardEvent) => {
      // Add the new key to the buffer
      inputRef.current.push(e.key);

      // Maintain the buffer size equal to the sequence length (sliding window)
      if (inputRef.current.length > sequence.length) {
        inputRef.current.shift();
      }

      // Check for a match
      if (JSON.stringify(inputRef.current) === JSON.stringify(sequence)) {
        actionRef.current();
        inputRef.current = []; // Reset buffer after successful activation
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []); // Empty dependency array ensures listener is attached only once
};
