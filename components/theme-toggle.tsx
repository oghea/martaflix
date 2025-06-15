import { Button, ButtonText } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import * as React from 'react';

// Memoized Theme Toggle Component
export const ThemeToggle = React.memo(() => {
  const { theme, toggleTheme, isDarkMode } = useTheme();

  return (
    <Button
      onPress={toggleTheme}
      variant="outline"
      size="sm"
      className="rounded-full px-4 py-2 border shadow-sm"
      style={{
        backgroundColor: theme.colors.card.background,
        borderColor: theme.colors.border,
      }}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      accessibilityHint={`Currently in ${isDarkMode ? 'dark' : 'light'} mode. Double tap to toggle theme.`}
    >
      <ButtonText
        className="font-semibold"
        style={{ color: theme.colors.text.primary }}
      >
        {isDarkMode ? '☀️ Light' : '🌙 Dark'}
      </ButtonText>
    </Button>
  );
});

ThemeToggle.displayName = 'ThemeToggle'; 