import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useTheme } from '@/hooks/use-theme';
import * as React from 'react';

type Props = {
  title?: string;
  message?: string;
};

export function EmptyState({ 
  title = 'No movies found',
  message = 'We couldn\'t find any movies at the moment. Please try again later.'
}: Props) {
  const { theme } = useTheme();
  
  return (
    <View className="flex-1 items-center justify-center p-6">
      <View className="items-center">
        <View 
          className="mb-4 h-16 w-16 items-center justify-center rounded-full"
          style={{ backgroundColor: theme.colors.placeholder.background }}
        >
          <Text className="text-2xl">🎬</Text>
        </View>
        
        <Heading 
          size="md" 
          className="mb-2 text-center"
          style={{ color: theme.colors.text.primary }}
        >
          {title}
        </Heading>
        
        <Text 
          className="text-center"
          style={{ color: theme.colors.text.secondary }}
        >
          {message}
        </Text>
      </View>
    </View>
  );
} 