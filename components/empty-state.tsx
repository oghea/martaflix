import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { VStack } from '@/components/ui/vstack';
import { useTheme } from '@/hooks/use-theme';
import * as React from 'react';

type Props = {
  title?: string;
  message?: string;
};

// Memoized Empty State Component
export const EmptyState = React.memo(({ 
  title = 'No movies found',
  message = 'We couldn\'t find any movies at the moment. Please try again later.'
}: Props) => {
  const { theme } = useTheme();
  
  return (
    <VStack 
      className="flex-1 items-center justify-center px-8 py-12"
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`${title}. ${message}`}
    >
      <VStack className="items-center max-w-sm" space="lg">
        <View 
          className="mb-2 h-20 w-20 items-center justify-center rounded-full shadow-sm"
          style={{ backgroundColor: theme.colors.placeholder.background }}
          accessible={true}
          accessibilityRole="image"
          accessibilityLabel="Empty state icon"
        >
          <Text 
            className="text-2xl"
            accessible={false}
          >
            🎬
          </Text>
        </View>
        
        <VStack className="items-center" space="md">
          <Heading 
            size="lg" 
            className="text-center font-semibold"
            style={{ color: theme.colors.text.primary }}
            accessibilityRole="heading"
            accessibilityLevel={2}
          >
            {title}
          </Heading>
          
          <Text 
            size="md"
            className="text-center leading-relaxed"
            style={{ color: theme.colors.text.secondary }}
            accessible={true}
            accessibilityRole="text"
          >
            {message}
          </Text>
        </VStack>
      </VStack>
    </VStack>
  );
});

EmptyState.displayName = 'EmptyState'; 