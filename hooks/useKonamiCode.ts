
import { useEffect, useState } from 'react';

export const useKonamiCode = (action: () => void) => {
  const [input, setInput] = useState<string[]>([]);
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newItem = e.key;
      const newInput = [...input, newItem];

      // Keep only the last n keys where n is the sequence length
      if (newInput.length > sequence.length) {
        newInput.shift();
      }

      setInput(newInput);

      // Check if the sequence matches
      if (JSON.stringify(newInput) === JSON.stringify(sequence)) {
        action();
        setInput([]); // Reset
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input, action]); // Removed sequence from dep array to avoid re-bind
};
