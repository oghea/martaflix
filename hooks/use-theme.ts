import { useThemeStore } from '@/store/theme-store';
import type { Theme, ThemeMode } from '@/types/theme';

export function useTheme(): {
  theme: Theme;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  setSystemTheme: () => void;
  isDarkMode: boolean;
} {
  const { theme, themeMode, toggleTheme, setTheme, setSystemTheme } = useThemeStore();
  
  return {
    theme,
    themeMode,
    toggleTheme,
    setTheme,
    setSystemTheme,
    isDarkMode: themeMode === 'dark',
  };
} 