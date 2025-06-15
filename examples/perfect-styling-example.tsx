import { Button, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FlatList } from '@/components/ui/flat-list';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Pressable } from '@/components/ui/pressable';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { StatusBar } from '@/components/ui/status-bar';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { VStack } from '@/components/ui/vstack';
import { useTheme } from '@/hooks/use-theme';
import React, { useCallback, useMemo, useState } from 'react';

// Mock data for demonstration
const DEMO_ITEMS = [
  { id: '1', title: 'Profile Settings', description: 'Manage your account' },
  { id: '2', title: 'Notifications', description: 'Configure alerts' },
  { id: '3', title: 'Privacy', description: 'Control your data' },
  { id: '4', title: 'Help & Support', description: 'Get assistance' },
];

// Memoized components following performance best practices
const SettingsItem = React.memo(({ 
  item, 
  onPress, 
  theme 
}: { 
  item: typeof DEMO_ITEMS[0]; 
  onPress: (id: string) => void;
  theme: any;
}) => {
  return (
    <Pressable
      onPress={() => onPress(item.id)}
      style={[
        {
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.card.background,
        }
      ]}
      className="mx-4 mb-3 p-4 rounded-xl border"
      // Accessibility props following a11y standards
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}: ${item.description}`}
      accessibilityHint="Double tap to open settings"
    >
      <VStack space="xs">
        <Text 
          size="lg" 
          className="font-semibold"
          style={{ color: theme.colors.text.primary }}
        >
          {item.title}
        </Text>
        <Text 
          size="sm"
          style={{ color: theme.colors.text.secondary }}
        >
          {item.description}
        </Text>
      </VStack>
    </Pressable>
  );
});

SettingsItem.displayName = 'SettingsItem';

export default function PerfectStylingExample() {
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);

  // Memoized handlers to prevent unnecessary re-renders
  const handleItemPress = useCallback((id: string) => {
    console.log(`Pressed item: ${id}`);
    // Handle navigation or action
  }, []);

  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  const handleNotificationToggle = useCallback((value: boolean) => {
    setIsNotificationsEnabled(value);
  }, []);

  // Memoized filtered data to optimize performance
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return DEMO_ITEMS;
    return DEMO_ITEMS.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Memoized render function for FlatList optimization
  const renderItem = useCallback(({ item }: { item: typeof DEMO_ITEMS[0] }) => (
    <SettingsItem 
      item={item} 
      onPress={handleItemPress}
      theme={theme}
    />
  ), [handleItemPress, theme]);

  const keyExtractor = useCallback((item: typeof DEMO_ITEMS[0]) => item.id, []);

  return (
    <SafeAreaView 
      className="flex-1"
      style={{ backgroundColor: theme.colors.background }}
    >
      <StatusBar
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />

      {/* Header */}
      <View
        className="px-4 py-6 border-b"
        style={{
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.border,
        }}
      >
        <VStack space="md">
          <HStack className="justify-between items-center">
            <Heading 
              size="2xl" 
              className="font-bold"
              style={{ color: theme.colors.text.primary }}
              // Accessibility for screen readers
              accessibilityRole="heading"
              accessibilityLevel={1}
            >
              Perfect Styling
            </Heading>
            
            {/* Theme toggle with proper accessibility */}
            <Switch
              value={theme.mode === 'dark'}
              onValueChange={toggleTheme}
              accessible={true}
              accessibilityRole="switch"
              accessibilityLabel="Toggle dark mode"
              accessibilityHint={`Currently ${theme.mode} mode. Double tap to switch to ${theme.mode === 'dark' ? 'light' : 'dark'} mode`}
            />
          </HStack>

          <Text 
            size="md"
            style={{ color: theme.colors.text.secondary }}
            accessibilityRole="text"
          >
            Example of perfect styling following all cursor rules
          </Text>
        </VStack>
      </View>

      <VStack className="flex-1" space="md">
        {/* Search Input with proper accessibility */}
        <View className="px-4 pt-4">
          <Input
            variant="outline"
            size="md"
            style={{ backgroundColor: theme.colors.background }}
            accessible={true}
            accessibilityLabel="Search settings"
          >
            <InputField
              placeholder="Search settings..."
              value={searchQuery}
              onChangeText={handleSearchChange}
              placeholderTextColor={theme.colors.text.tertiary}
              style={{ color: theme.colors.text.primary }}
              accessibilityHint="Type to filter settings options"
            />
          </Input>
        </View>

        {/* Settings Card with notification toggle */}
        <View className="mx-4">
          <Card
            className="p-4"
            style={{ backgroundColor: theme.colors.card.background }}
          >
            <HStack className="justify-between items-center">
              <VStack>
                <Text 
                  size="lg" 
                  className="font-semibold"
                  style={{ color: theme.colors.text.primary }}
                >
                  Push Notifications
                </Text>
                <Text 
                  size="sm"
                  style={{ color: theme.colors.text.secondary }}
                >
                  Receive alerts and updates
                </Text>
              </VStack>
              
              <Switch
                value={isNotificationsEnabled}
                onValueChange={handleNotificationToggle}
                accessible={true}
                accessibilityRole="switch"
                accessibilityLabel="Enable push notifications"
                accessibilityHint={`Notifications are currently ${isNotificationsEnabled ? 'enabled' : 'disabled'}`}
              />
            </HStack>
          </Card>
        </View>

        {/* Settings List with optimized FlatList */}
        <View className="flex-1">
          <FlatList
            data={filteredItems}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            // Performance optimizations
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
            // Accessibility
            accessible={true}
            accessibilityRole="list"
            accessibilityLabel="Settings list"
          />
        </View>

        {/* Action Buttons */}
        <View className="px-4 pb-4">
          <VStack space="sm">
            <Button
              size="lg"
              variant="solid"
              className="w-full"
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Save settings"
              accessibilityHint="Double tap to save your changes"
            >
              <ButtonText>Save Changes</ButtonText>
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="w-full"
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Reset to defaults"
              accessibilityHint="Double tap to reset all settings to default values"
            >
              <ButtonText>Reset to Defaults</ButtonText>
            </Button>
          </VStack>
        </View>
      </VStack>
    </SafeAreaView>
  );
} 