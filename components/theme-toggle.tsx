import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/use-theme';
import * as React from 'react';
import { Platform, TouchableOpacity } from 'react-native';

export function ThemeToggle() {
  const { theme, toggleTheme, isDarkMode } = useTheme();

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={{
        backgroundColor: theme.colors.card.background,
        borderRadius: 25,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: theme.colors.border,
        ...Platform.select({
          ios: {
            shadowColor: theme.colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          },
          android: {
            elevation: 4,
          },
        }),
      }}
    >
      <Text
        style={{
          color: theme.colors.text.primary,
          fontSize: 14,
          fontWeight: '600',
        }}
      >
        {isDarkMode ? '☀️ Light' : '🌙 Dark'}
      </Text>
    </TouchableOpacity>
  );
} 