import { Heading } from '@/components/ui/heading';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useTheme } from '@/hooks/use-theme';
import { useLocalSearchParams } from 'expo-router';
import * as React from 'react';

export default function MovieDetailScreen(): React.JSX.Element {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View className="flex-1 items-center justify-center p-4">
        <Heading 
          size="xl" 
          className="mb-4"
          style={{ color: theme.colors.text.primary }}
        >
          Movie Details
        </Heading>
        
        <Text style={{ color: theme.colors.text.secondary }}>
          Movie ID: {id}
        </Text>
        
        <Text 
          className="mt-4 text-center"
          style={{ color: theme.colors.text.tertiary }}
        >
          This is a placeholder screen for movie details.
          {'\n'}The full implementation would show movie information, cast, reviews, etc.
        </Text>
      </View>
    </SafeAreaView>
  );
} 