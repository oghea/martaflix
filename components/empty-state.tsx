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
    <View className="flex-1 items-center justify-center px-8 py-12">
      <View className="items-center max-w-sm">
        <View 
          className="mb-6 h-20 w-20 items-center justify-center rounded-full shadow-sm"
          style={{ backgroundColor: theme.colors.placeholder.background }}
        >
          <Text className="text-2xl">🎬</Text>
        </View>
        
        <Heading 
          size="lg" 
          className="mb-3 text-center font-semibold"
          style={{ color: theme.colors.text.primary }}
        >
          {title}
        </Heading>
        
        <Text 
          className="text-center text-base leading-relaxed"
          style={{ color: theme.colors.text.secondary }}
        >
          {message}
        </Text>
      </View>
    </View>
  );
} 