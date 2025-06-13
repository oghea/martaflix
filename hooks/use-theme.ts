import { useThemeStore } from '@/lib/theme-store';
import type { Theme, ThemeMode } from '@/types/theme';

export function useTheme(): {
  theme: Theme;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  isDarkMode: boolean;
} {
  const { theme, themeMode, toggleTheme, setTheme } = useThemeStore();
  
  return {
    theme,
    themeMode,
    toggleTheme,
    setTheme,
    isDarkMode: themeMode === 'dark',
  };
} 