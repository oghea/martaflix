import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type SettingItemProps = {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
  showArrow?: boolean;
};

function SettingItem({ 
  title, 
  subtitle, 
  onPress, 
  rightComponent, 
  showArrow = false 
}: SettingItemProps) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: theme.colors.surface,
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: theme.colors.border,
      }}
      disabled={!onPress}
    >
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text.primary,
            marginBottom: subtitle ? 4 : 0,
          }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={{
              fontSize: 14,
              color: theme.colors.text.secondary,
            }}
          >
            {subtitle}
          </Text>
        )}
      </View>
      
      {rightComponent && (
        <View style={{ marginLeft: 16 }}>
          {rightComponent}
        </View>
      )}
      
      {showArrow && (
        <View style={{ marginLeft: 16 }}>
          <Text
            style={{
              fontSize: 18,
              color: theme.colors.text.tertiary,
            }}
          >
            〉
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const { theme, toggleTheme } = useTheme();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      edges={['top']}
    >
      <StatusBar
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      
      <ScrollView style={{ flex: 1 }}>
        {/* Header */}
        <View
          style={{
            padding: 16,
            backgroundColor: theme.colors.surface,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: theme.colors.text.primary,
            }}
          >
            Settings
          </Text>
        </View>

        {/* Settings Content */}
        <View style={{ padding: 16 }}>
          {/* Appearance Section */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: theme.colors.text.primary,
              marginBottom: 12,
            }}
          >
            Appearance
          </Text>
          
          <SettingItem
            title="Theme"
            subtitle={`Current: ${theme.mode === 'dark' ? 'Dark' : 'Light'} mode`}
            onPress={toggleTheme}
            rightComponent={
              <View
                style={{
                  backgroundColor: theme.colors.primary,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                }}
              >
                <Text
                  style={{
                    color: theme.mode === 'dark' ? theme.colors.background : theme.colors.surface,
                    fontSize: 12,
                    fontWeight: '600',
                  }}
                >
                  {theme.mode === 'dark' ? '🌙' : '☀️'}
                </Text>
              </View>
            }
          />

          {/* App Info */}
          <View
            style={{
              backgroundColor: theme.colors.surface,
              padding: 16,
              borderRadius: 12,
              marginTop: 24,
              borderWidth: 1,
              borderColor: theme.colors.border,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 32,
                marginBottom: 8,
              }}
            >
              🎬
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: theme.colors.text.primary,
                marginBottom: 4,
              }}
            >
              Martaflix
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: theme.colors.text.secondary,
                textAlign: 'center',
              }}
            >
              Version 1.0.0{'\n'}
              Made with ❤️ using React Native & Expo
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 