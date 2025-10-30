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
            '--color-bg-dark-default': '#0D1117',
            '--color-bg-dark-secondary': '#161B22',
            '--color-accent-default': '#00BFFF',
            '--color-accent-hover': '#38CCFF',
            '--color-border': '#30363D',
            '--color-text-default': '#E6EDF3',
            '--color-text-secondary': '#7D8590',
            '--color-surface': '#161B22',
        },
        background: DEFAULT_BACKGROUND,
    },
    "Arctic Light": {
        name: "Arctic Light",
        colors: {
            '--color-bg-dark-default': '#F0F2F5',
            '--color-bg-dark-secondary': '#FFFFFF',
            '--color-accent-default': '#1877F2',
            '--color-accent-hover': '#4090F7',
            '--color-border': '#DADDE1',
            '--color-text-default': '#050505',
            '--color-text-secondary': '#65676B',
            '--color-surface': '#FFFFFF',
        },
        background: DEFAULT_BACKGROUND,
    },
    "Blueprint": {
        name: "Blueprint",
        colors: {
            '--color-bg-dark-default': '#0A192F',
            '--color-bg-dark-secondary': '#020C1B',
            '--color-accent-default': '#64FFDA',
            '--color-accent-hover': '#9BFFE9',
            '--color-border': '#172A45',
            '--color-text-default': '#CCD6F6',
            '--color-text-secondary': '#8892B0',
            '--color-surface': '#172A45',
        },
        background: DEFAULT_BACKGROUND,
    },
    "Neon Matrix": {
        name: "Neon Matrix",
        colors: {
            '--color-bg-dark-default': '#000000',
            '--color-bg-dark-secondary': '#0A0A0A',
            '--color-accent-default': '#00FF41',
            '--color-accent-hover': '#5FFF84',
            '--color-border': '#003B00',
            '--color-text-default': '#00FF41',
            '--color-text-secondary': '#008F11',
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