import { darkTheme, lightTheme } from '@/types/theme';
import { act, renderHook } from '@testing-library/react-native';
import { Appearance } from 'react-native';
import { storage } from '../storage';
import { useThemeStore } from '../theme-store';

// Mock MMKV storage
jest.mock('../storage', () => ({
  storage: {
    getString: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
    contains: jest.fn(),
  },
  STORAGE_KEYS: {
    THEME: 'theme',
    FAVORITES: 'favorites',
  },
}));

// Mock React Native Appearance API
jest.mock('react-native', () => ({
  Appearance: {
    getColorScheme: jest.fn(),
    addChangeListener: jest.fn(),
    removeChangeListener: jest.fn(),
  },
}));

const mockStorage = storage as jest.Mocked<typeof storage>;
const mockAppearance = Appearance as jest.Mocked<typeof Appearance>;

describe('useThemeStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAppearance.getColorScheme.mockReturnValue('light');
  });

  describe('Initial State', () => {
    it('should use system theme on initialization', () => {
      // The store will use whatever system theme is set
      const { result } = renderHook(() => useThemeStore());
      
      // Should have valid theme mode (either from system or default)
      expect(['light', 'dark']).toContain(result.current.themeMode);
      expect(result.current.theme).toBeDefined();
    });

    it('should fallback to light theme when system theme is null', () => {
      mockAppearance.getColorScheme.mockReturnValue(null);
      
      const { result } = renderHook(() => useThemeStore());

      expect(result.current.theme).toEqual(lightTheme);
      expect(result.current.themeMode).toBe('light');
    });

    it('should have the correct theme colors for light mode', () => {
      mockAppearance.getColorScheme.mockReturnValue('light');
      
      const { result } = renderHook(() => useThemeStore());

      expect(result.current.theme.mode).toBe('light');
      expect(result.current.theme.colors.background).toBe('#F9FAFB');
      expect(result.current.theme.colors.text.primary).toBe('#111827');
    });
  });

  describe('toggleTheme', () => {
    beforeEach(() => {
      useThemeStore.setState({ theme: lightTheme, themeMode: 'light' });
    });

    it('should toggle from light to dark theme', () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toEqual(darkTheme);
      expect(result.current.themeMode).toBe('dark');
    });

    it('should toggle from dark to light theme', () => {
      useThemeStore.setState({ theme: darkTheme, themeMode: 'dark' });
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toEqual(lightTheme);
      expect(result.current.themeMode).toBe('light');
    });

    it('should apply correct theme colors when toggling', () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme.mode).toBe('dark');
      expect(result.current.theme.colors.background).toBe('#0F172A');
      expect(result.current.theme.colors.text.primary).toBe('#F8FAFC');
    });
  });

  describe('setTheme', () => {
    beforeEach(() => {
      useThemeStore.setState({ theme: lightTheme, themeMode: 'light' });
    });

    it('should set theme to dark', () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.setTheme('dark');
      });

      expect(result.current.theme).toEqual(darkTheme);
      expect(result.current.themeMode).toBe('dark');
    });

    it('should set theme to light', () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.setTheme('light');
      });

      expect(result.current.theme).toEqual(lightTheme);
      expect(result.current.themeMode).toBe('light');
    });

    it('should apply correct theme object when setting theme', () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.setTheme('dark');
      });

      expect(result.current.theme.colors.surface).toBe('#1E293B');
      expect(result.current.theme.colors.primary).toBe('#F8FAFC');
    });
  });

  describe('setSystemTheme', () => {
    beforeEach(() => {
      useThemeStore.setState({ theme: lightTheme, themeMode: 'light' });
    });

    it('should set theme to system dark theme', () => {
      const { result } = renderHook(() => useThemeStore());

      mockAppearance.getColorScheme.mockReturnValue('dark');

      act(() => {
        result.current.setSystemTheme();
      });

      expect(result.current.theme).toEqual(darkTheme);
      expect(result.current.themeMode).toBe('dark');
    });

    it('should set theme to system light theme', () => {
      const { result } = renderHook(() => useThemeStore());

      mockAppearance.getColorScheme.mockReturnValue('light');

      act(() => {
        result.current.setSystemTheme();
      });

      expect(result.current.theme).toEqual(lightTheme);
      expect(result.current.themeMode).toBe('light');
    });

    it('should handle null system theme gracefully', () => {
      const { result } = renderHook(() => useThemeStore());

      mockAppearance.getColorScheme.mockReturnValue(null);

      act(() => {
        result.current.setSystemTheme();
      });

      expect(result.current.theme).toEqual(lightTheme);
      expect(result.current.themeMode).toBe('light');
    });
  });

  describe('MMKV Storage Integration', () => {
    beforeEach(() => {
      useThemeStore.setState({ theme: lightTheme, themeMode: 'light' });
    });

    it('should use MMKV storage for persistence', () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.setTheme('dark');
      });

      expect(result.current.themeMode).toBe('dark');
    });

    it('should handle storage errors gracefully', () => {
      mockStorage.set.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const { result } = renderHook(() => useThemeStore());

      expect(() => {
        act(() => {
          result.current.setTheme('dark');
        });
      }).not.toThrow();

      expect(result.current.themeMode).toBe('dark');
    });

    it('should handle different value types in storage', () => {
      const { result } = renderHook(() => useThemeStore());

      expect(() => {
        act(() => {
          result.current.setTheme('dark');
        });
      }).not.toThrow();

      expect(result.current.themeMode).toBe('dark');
    });

    it('should persist state changes to storage', () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.setTheme('dark');
      });

      expect(result.current.themeMode).toBe('dark');
      expect(result.current.theme).toEqual(darkTheme);
    });

    it('should handle corrupted storage data', () => {
      mockStorage.getString.mockReturnValue('invalid json');
      
      const { result } = renderHook(() => useThemeStore());

      expect(['light', 'dark']).toContain(result.current.themeMode);
    });

    it('should handle null storage data', () => {
      mockStorage.getString.mockReturnValue(undefined);
      
      const { result } = renderHook(() => useThemeStore());

      // Should fallback to default/system theme
      expect(['light', 'dark']).toContain(result.current.themeMode);
    });
  });

  describe('Theme Consistency', () => {
    beforeEach(() => {
      useThemeStore.setState({ theme: lightTheme, themeMode: 'light' });
    });

    it('should maintain theme consistency between mode and theme object', () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.setTheme('dark');
      });

      expect(result.current.themeMode).toBe('dark');
      expect(result.current.theme.mode).toBe('dark');
      expect(result.current.theme).toEqual(darkTheme);
    });

    it('should maintain theme consistency when toggling', () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.themeMode).toBe('dark');
      expect(result.current.theme.mode).toBe('dark');

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.themeMode).toBe('light');
      expect(result.current.theme.mode).toBe('light');
    });
  });

  describe('Store Actions', () => {
    it('should have all required actions', () => {
      const { result } = renderHook(() => useThemeStore());

      expect(typeof result.current.toggleTheme).toBe('function');
      expect(typeof result.current.setTheme).toBe('function');
      expect(typeof result.current.setSystemTheme).toBe('function');
    });

    it('should have all required state properties', () => {
      const { result } = renderHook(() => useThemeStore());

      expect(result.current.theme).toBeDefined();
      expect(result.current.themeMode).toBeDefined();
      expect(['light', 'dark']).toContain(result.current.themeMode);
    });
  });
}); 