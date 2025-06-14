import '@testing-library/react-native/extend-expect';

// Mock AsyncStorage (still needed for other dependencies)
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
}));

// Mock MMKV
jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn().mockImplementation(() => ({
    set: jest.fn(),
    getString: jest.fn(),
    delete: jest.fn(),
    contains: jest.fn(),
    clearAll: jest.fn(),
  })),
}));

// Mock Lucide React Native
jest.mock('lucide-react-native', () => ({
  Heart: 'Heart',
  Search: 'Search',
  Star: 'Star',
  Calendar: 'Calendar',
  Clock: 'Clock',
  User: 'User',
  Film: 'Film',
  Play: 'Play',
  Plus: 'Plus',
  Minus: 'Minus',
  X: 'X',
  ChevronLeft: 'ChevronLeft',
  ChevronRight: 'ChevronRight',
  RefreshCw: 'RefreshCw',
}));

// Mock Expo modules
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    back: jest.fn(),
  },
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
}));

// Mock MMKV
jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn(() => ({
    set: jest.fn(),
    getString: jest.fn(),
    delete: jest.fn(),
    contains: jest.fn(),
  })),
}));

// Mock React Native components
jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 20, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: ({ children }) => children,
    useSafeAreaInsets: () => inset,
  };
});



// Silence the warning about React.createRef
global.console.warn = jest.fn();
global.console.error = jest.fn(); 