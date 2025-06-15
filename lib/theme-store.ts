import type { Theme, ThemeMode } from '@/types/theme';
import { darkTheme, lightTheme } from '@/types/theme';
import { Appearance } from 'react-native';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { STORAGE_KEYS, storageUtils } from './storage';

type ThemeState = {
  theme: Theme;
  themeMode: ThemeMode;
  isLoading: boolean;
};

type ThemeActions = {
  initializeTheme: () => void;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  setSystemTheme: () => void;
};

// Helper function to get system theme
const getSystemTheme = (): ThemeMode => {
  const colorScheme = Appearance.getColorScheme();
  return colorScheme === 'dark' ? 'dark' : 'light';
};

// Helper function to get theme object from mode
const getThemeFromMode = (mode: ThemeMode): Theme => {
  return mode === 'dark' ? darkTheme : lightTheme;
};

// Get initial theme - check storage first, fallback to system theme
const getInitialTheme = (): { mode: ThemeMode; theme: Theme } => {
  // Try to get stored theme preference
  const storedThemeMode = storageUtils.get<ThemeMode>(STORAGE_KEYS.THEME);
  
  if (storedThemeMode && (storedThemeMode === 'light' || storedThemeMode === 'dark')) {
    // Use stored preference
    return {
      mode: storedThemeMode,
      theme: getThemeFromMode(storedThemeMode)
    };
  }
  
  // Use system theme on first install and save it
  const systemMode = getSystemTheme();
  storageUtils.set(STORAGE_KEYS.THEME, systemMode);
  
  return {
    mode: systemMode,
    theme: getThemeFromMode(systemMode)
  };
};

const { mode: initialThemeMode, theme: initialTheme } = getInitialTheme();

export const useThemeStore = create<ThemeState & ThemeActions>()(
  devtools(
    (set, get) => ({
      // State - now properly initialized with stored or system theme
      theme: initialTheme,
      themeMode: initialThemeMode,
      isLoading: false,

      // Actions
      initializeTheme: () => {
        // This method is now optional since theme is auto-initialized
        // but kept for backward compatibility
        set({ isLoading: true });
        
        const storedThemeMode = storageUtils.get<ThemeMode>(STORAGE_KEYS.THEME);
        
        if (storedThemeMode && (storedThemeMode === 'light' || storedThemeMode === 'dark')) {
          const theme = getThemeFromMode(storedThemeMode);
          set({ 
            themeMode: storedThemeMode, 
            theme,
            isLoading: false 
          });
        } else {
          const systemMode = getSystemTheme();
          const systemTheme = getThemeFromMode(systemMode);
          set({ 
            themeMode: systemMode, 
            theme: systemTheme,
            isLoading: false 
          });
          storageUtils.set(STORAGE_KEYS.THEME, systemMode);
        }
      },
      
      toggleTheme: () => {
        const { themeMode } = get();
        const newMode = themeMode === 'light' ? 'dark' : 'light';
        const newTheme = getThemeFromMode(newMode);
        
        set({
          themeMode: newMode,
          theme: newTheme,
        });
        
        // Save to storage
        storageUtils.set(STORAGE_KEYS.THEME, newMode);
      },
      
      setTheme: (mode: ThemeMode) => {
        const newTheme = getThemeFromMode(mode);
        
        set({
          themeMode: mode,
          theme: newTheme,
        });
        
        // Save to storage
        storageUtils.set(STORAGE_KEYS.THEME, mode);
      },

      setSystemTheme: () => {
        const systemMode = getSystemTheme();
        const systemTheme = getThemeFromMode(systemMode);
        
        set({
          themeMode: systemMode,
          theme: systemTheme,
        });
        
        // Save to storage
        storageUtils.set(STORAGE_KEYS.THEME, systemMode);
      },
    }),
    {
      name: 'theme-store',
    }
  )
); 