import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { ScrollView } from '@/components/ui/scroll-view';
import { StatusBar } from '@/components/ui/status-bar';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { VStack } from '@/components/ui/vstack';
import { useFavorites } from '@/hooks/use-favorites';
import { useTheme } from '@/hooks/use-theme';
import React, { useCallback } from 'react';
import { Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type SettingItemProps = {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
  showArrow?: boolean;
  destructive?: boolean;
  icon?: string;
};

const SettingItem = React.memo(({
  title,
  subtitle,
  onPress,
  rightComponent,
  showArrow = true,
  destructive = false,
  icon,
}: SettingItemProps) => {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        }
      ]}
      className="p-4 mb-2 rounded-xl border active:scale-98 active:opacity-80"
      disabled={!onPress}
      // Accessibility props
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${title}${subtitle ? `: ${subtitle}` : ''}`}
      accessibilityHint={onPress ? "Double tap to activate" : undefined}
    >
      <HStack className="items-center justify-between">
        <HStack className="flex-1 items-center" space="md">
          {icon && (
            <Text size="lg" accessibilityRole="text">
              {icon}
            </Text>
          )}
          <VStack className="flex-1">
            <Text
              size="md"
              className="font-semibold"
              style={{ 
                color: destructive ? '#ef4444' : theme.colors.text.primary 
              }}
            >
              {title}
            </Text>
            {subtitle && (
              <Text
                size="sm"
                style={{ color: theme.colors.text.secondary }}
              >
                {subtitle}
              </Text>
            )}
          </VStack>
        </HStack>
        
        {rightComponent && (
          <View className="ml-3">
            {rightComponent}
          </View>
        )}
        
        {showArrow && onPress && !rightComponent && (
          <Text
            size="md"
            style={{ color: theme.colors.text.tertiary }}
            className="ml-3"
          >
            →
          </Text>
        )}
      </HStack>
    </Pressable>
  );
});

SettingItem.displayName = 'SettingItem';

export default function SettingsScreen() {
  const { theme, toggleTheme, setSystemTheme } = useTheme();
  const { favoritesCount, clearAllFavorites } = useFavorites();

  // Memoized handlers to prevent unnecessary re-renders
  const handleClearFavorites = useCallback(() => {
    if (favoritesCount === 0) {
      Alert.alert(
        'No Favorites',
        'You don\'t have any favorite movies to clear.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Clear All Favorites',
      `Are you sure you want to remove all ${favoritesCount} favorite movie${favoritesCount !== 1 ? 's' : ''}? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            clearAllFavorites();
            Alert.alert('Success', 'All favorites have been cleared.');
          },
        },
      ]
    );
  }, [favoritesCount, clearAllFavorites]);

  const handleUseSystemTheme = useCallback(() => {
    Alert.alert(
      'Use System Theme',
      'This will change the app theme to match your device\'s system theme setting.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Use System Theme',
          onPress: () => {
            setSystemTheme();
            Alert.alert('Success', 'Theme updated to match system setting.');
          },
        },
      ]
    );
  }, [setSystemTheme]);

  const handleToggleTheme = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.colors.background }}
      edges={['top']}
    >
      <StatusBar
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      
      <ScrollView className="flex-1">
        {/* Header */}
        <View
          className="p-4 border-b"
          style={{
            backgroundColor: theme.colors.surface,
            borderBottomColor: theme.colors.border,
          }}
        >
          <Text
            size="2xl"
            className="font-bold"
            style={{ color: theme.colors.text.primary }}
          >
            Settings
          </Text>
        </View>

        {/* Settings Content */}
        <View className="p-4">
          {/* Appearance Section */}
          <Text
            size="lg"
            className="font-bold mb-3"
            style={{ color: theme.colors.text.primary }}
          >
            Appearance
          </Text>
          
          <VStack space="xs">
            <SettingItem
              title="Toggle Theme"
              subtitle={`Current: ${theme.mode === 'dark' ? 'Dark' : 'Light'} mode`}
              onPress={handleToggleTheme}
              icon={theme.mode === 'dark' ? '🌙' : '☀️'}
              rightComponent={
                <View
                  className="px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  <Text
                    size="xs"
                    className="font-semibold"
                    style={{
                      color: theme.mode === 'dark' ? theme.colors.background : theme.colors.surface,
                    }}
                  >
                    {theme.mode === 'dark' ? 'Dark' : 'Light'}
                  </Text>
                </View>
              }
            />

            <SettingItem
              title="Use System Theme"
              subtitle="Match your device's theme setting"
              onPress={handleUseSystemTheme}
              icon="📱"
            />
          </VStack>

          {/* Favorites Section */}
          <Text
            size="lg"
            className="font-bold mb-3 mt-6"
            style={{ color: theme.colors.text.primary }}
          >
            Favorites
          </Text>
          
          <SettingItem
            title="Clear All Favorites"
            subtitle={`${favoritesCount} movie${favoritesCount !== 1 ? 's' : ''} saved`}
            onPress={handleClearFavorites}
            destructive={true}
            icon="🗑️"
          />

          {/* App Info */}
          <View
            className="mt-6 p-4 rounded-xl border items-center"
            style={{
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            }}
          >
            <Text
              size="3xl"
              className="mb-2"
              accessibilityRole="text"
              accessibilityLabel="Movie app icon"
            >
              🎬
            </Text>
            <Text
              size="lg"
              className="font-bold mb-1"
              style={{ color: theme.colors.text.primary }}
            >
              Martaflix
            </Text>
            <Text
              size="sm"
              className="text-center"
              style={{ color: theme.colors.text.secondary }}
            >
              Your personal movie discovery app
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 