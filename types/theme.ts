export type ThemeMode = 'light' | 'dark';

export type ThemeColors = {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  border: string;
  shadow: string;
  card: {
    background: string;
    border: string;
  };
  badge: {
    background: string;
    text: string;
  };
  rating: {
    background: string;
    text: string;
  };
  placeholder: {
    background: string;
    text: string;
  };
};

export type Theme = {
  mode: ThemeMode;
  colors: ThemeColors;
};

export const lightTheme: Theme = {
  mode: 'light',
  colors: {
    background: '#F9FAFB',
    surface: '#FFFFFF',
    primary: '#1F2937',
    secondary: '#6B7280',
    text: {
      primary: '#111827',
      secondary: '#6B7280',
      tertiary: '#9CA3AF',
    },
    border: '#F3F4F6',
    shadow: '#000000',
    card: {
      background: '#FFFFFF',
      border: '#F3F4F6',
    },
    badge: {
      background: '#E0E7FF',
      text: '#3730A3',
    },
    rating: {
      background: '#F59E0B',
      text: '#FFFFFF',
    },
    placeholder: {
      background: '#F3F4F6',
      text: '#6B7280',
    },
  },
};

export const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    background: '#0F172A',
    surface: '#1E293B',
    primary: '#F8FAFC',
    secondary: '#94A3B8',
    text: {
      primary: '#F8FAFC',
      secondary: '#CBD5E1',
      tertiary: '#94A3B8',
    },
    border: '#334155',
    shadow: '#000000',
    card: {
      background: '#1E293B',
      border: '#334155',
    },
    badge: {
      background: '#3B82F6',
      text: '#FFFFFF',
    },
    rating: {
      background: '#F59E0B',
      text: '#FFFFFF',
    },
    placeholder: {
      background: '#374151',
      text: '#9CA3AF',
    },
  },
}; 