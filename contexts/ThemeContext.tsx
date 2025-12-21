
import React, { createContext, useContext, ReactNode, useEffect, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

// --- TYPE DEFINITIONS ---

export interface ThemeColors {
  '--color-bg-dark-default': string;
  '--color-bg-dark-secondary': string;
  '--color-accent-default': string;
  '--color-accent-hover': string;
  '--color-border': string;
  '--color-text-default': string;
  '--color-text-secondary': string;
  '--color-surface': string;
}

export interface BackgroundSettings {
  image: string | null;
  size: 'cover' | 'contain' | 'auto';
  repeat: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
  overlayOpacity: number;
}

export interface Theme {
  name: string;
  colors: ThemeColors;
  background: BackgroundSettings;
}

interface ThemeContextType {
  theme: Theme;
  setTheme: (themeName: string) => void;
  setCustomThemeColors: (colors: Partial<ThemeColors>) => void;
  setCustomBackground: (settings: Partial<BackgroundSettings>) => void;
  themes: Record<string, Theme>;
  customThemes: Record<string, Theme>;
  saveCurrentTheme: (newThemeName: string) => void;
  deleteTheme: (themeName: string) => void;
}

// --- THEME PRESETS ---

const DEFAULT_BACKGROUND: BackgroundSettings = {
    image: null,
    size: 'cover',
    repeat: 'no-repeat',
    overlayOpacity: 0.5,
};

const PRESET_THEMES: Record<string, Theme> = {
    "Blizzard Dark": {
        name: "Blizzard Dark",
        colors: {
            '--color-bg-dark-default': '#020617', // Slate 950
            '--color-bg-dark-secondary': '#0F172A', // Slate 900
            '--color-accent-default': '#0EA5E9', // Sky 500
            '--color-accent-hover': '#38BDF8', // Sky 400
            '--color-border': '#1E293B', // Slate 800
            '--color-text-default': '#F1F5F9', // Slate 100
            '--color-text-secondary': '#94A3B8', // Slate 400
            '--color-surface': '#1E293B', // Slate 800
        },
        background: DEFAULT_BACKGROUND,
    },
    "Arctic Light": {
        name: "Arctic Light",
        colors: {
            '--color-bg-dark-default': '#F8FAFC',
            '--color-bg-dark-secondary': '#FFFFFF',
            '--color-accent-default': '#2563EB',
            '--color-accent-hover': '#3B82F6',
            '--color-border': '#E2E8F0',
            '--color-text-default': '#0F172A',
            '--color-text-secondary': '#64748B',
            '--color-surface': '#FFFFFF',
        },
        background: DEFAULT_BACKGROUND,
    },
    "Blueprint": {
        name: "Blueprint",
        colors: {
            '--color-bg-dark-default': '#0F172A',
            '--color-bg-dark-secondary': '#1E293B',
            '--color-accent-default': '#F472B6',
            '--color-accent-hover': '#FBCFE8',
            '--color-border': '#334155',
            '--color-text-default': '#F8FAFC',
            '--color-text-secondary': '#94A3B8',
            '--color-surface': '#334155',
        },
        background: DEFAULT_BACKGROUND,
    },
    "Neon Matrix": {
        name: "Neon Matrix",
        colors: {
            '--color-bg-dark-default': '#000000',
            '--color-bg-dark-secondary': '#0A0A0A',
            '--color-accent-default': '#22C55E',
            '--color-accent-hover': '#4ADE80',
            '--color-border': '#14532D',
            '--color-text-default': '#22C55E',
            '--color-text-secondary': '#166534',
            '--color-surface': '#101010',
        },
        background: DEFAULT_BACKGROUND,
    }
};

// --- CONTEXT ---

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useLocalStorage<Theme>('brh-theme', PRESET_THEMES["Blizzard Dark"]);
  const [customThemes, setCustomThemes] = useLocalStorage<Record<string, Theme>>('brh-custom-themes', {});

  const applyTheme = useCallback((themeToApply: Theme) => {
    const root = document.documentElement;
    Object.entries(themeToApply.colors).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    root.style.setProperty('--bg-image', themeToApply.background.image ? `url(${themeToApply.background.image})` : 'none');
    root.style.setProperty('--bg-size', themeToApply.background.size);
    root.style.setProperty('--bg-repeat', themeToApply.background.repeat);
    root.style.setProperty('--bg-overlay-opacity', themeToApply.background.overlayOpacity.toString());
  }, []);
  
  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  const allThemes = { ...PRESET_THEMES, ...customThemes };

  const setTheme = (themeName: string) => {
    const newTheme = allThemes[themeName];
    if (newTheme) {
      setThemeState(newTheme);
    }
  };

  const setCustomThemeColors = (colors: Partial<ThemeColors>) => {
    setThemeState(prevTheme => ({
        ...prevTheme,
        name: "Custom",
        colors: {
            ...prevTheme.colors,
            ...colors,
        }
    }));
  };

  const setCustomBackground = (settings: Partial<BackgroundSettings>) => {
    setThemeState(prevTheme => ({
        ...prevTheme,
        name: "Custom",
        background: {
            ...prevTheme.background,
            ...settings,
        }
    }));
  };

  const saveCurrentTheme = (newThemeName: string) => {
    if (!newThemeName.trim() || PRESET_THEMES[newThemeName]) return; // Don't allow empty names or overwriting presets
    const newTheme = { ...theme, name: newThemeName };
    setCustomThemes(prev => ({ ...prev, [newThemeName]: newTheme }));
    setThemeState(newTheme); // Set the newly saved theme as active
  };

  const deleteTheme = (themeName: string) => {
    setCustomThemes(prev => {
        const newCustoms = { ...prev };
        delete newCustoms[themeName];
        return newCustoms;
    });
    // If deleting the currently active theme, revert to a default
    if (theme.name === themeName) {
        setThemeState(PRESET_THEMES["Blizzard Dark"]);
    }
  };


  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      setCustomThemeColors, 
      setCustomBackground, 
      themes: PRESET_THEMES,
      customThemes,
      saveCurrentTheme,
      deleteTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
