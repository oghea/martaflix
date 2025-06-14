import type { Theme, ThemeMode } from '@/types/theme';
import { darkTheme, lightTheme } from '@/types/theme';
import { Appearance } from 'react-native';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS, storage } from './storage';

type ThemeStore = {
  theme: Theme;
  themeMode: ThemeMode;
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

// Get initial theme from system
const initialThemeMode = getSystemTheme();
const initialTheme = getThemeFromMode(initialThemeMode);

// Custom MMKV storage implementation for Zustand
const mmkvStorage = {
  getItem: (name: string): string | null => {
    try {
      const value = storage.getString(name);
      return value || null;
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      // Ensure value is a string before storing
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      storage.set(name, stringValue);
    } catch (error) {
      console.error('Failed to save theme to storage:', error);
    }
  },
  removeItem: (name: string): void => {
    try {
      storage.delete(name);
    } catch (error) {
      console.error('Failed to remove theme from storage:', error);
    }
  },
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: initialTheme,
      themeMode: initialThemeMode,
      
      toggleTheme: () => {
        const currentMode = get().themeMode;
        const newMode = currentMode === 'light' ? 'dark' : 'light';
        const newTheme = getThemeFromMode(newMode);
        
        set({
          themeMode: newMode,
          theme: newTheme,
        });
      },
      
      setTheme: (mode: ThemeMode) => {
        const newTheme = getThemeFromMode(mode);
        set({
          themeMode: mode,
          theme: newTheme,
        });
      },

      setSystemTheme: () => {
        const systemMode = getSystemTheme();
        const systemTheme = getThemeFromMode(systemMode);
        set({
          themeMode: systemMode,
          theme: systemTheme,
        });
      },
    }),
    {
      name: STORAGE_KEYS.THEME,
      storage: mmkvStorage as any,
    }
  )
); 