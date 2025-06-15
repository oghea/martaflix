import { Alert } from '@/components/ui/alert';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useTheme } from '@/hooks/use-theme';
import * as React from 'react';

type Props = {
  error: Error | null;
  onRetry?: () => void;
  title?: string;
  message?: string;
};

// Memoized Error State Component
export const ErrorState = React.memo(({ 
  error, 
  onRetry, 
  title = 'Something went wrong',
  message 
}: Props) => {
  const { theme } = useTheme();
  const errorMessage = message || error?.message || 'An unexpected error occurred';

  return (
    <VStack 
      className="flex-1 items-center justify-center p-6"
      accessible={true}
      accessibilityRole="alert"
      accessibilityLabel={`Error: ${title}. ${errorMessage}`}
    >
      <Alert 
        className="w-full max-w-sm"
        style={{ 
          backgroundColor: theme.colors.card.background,
          borderColor: theme.colors.border,
        }}
      >
        <VStack className="items-center" space="md">
          <Heading 
            size="md" 
            className="text-center font-semibold"
            style={{ color: '#EF4444' }}
            accessibilityRole="heading"
            accessibilityLevel={2}
          >
            {title}
          </Heading>
          
          <Text 
            className="text-center"
            style={{ color: theme.colors.text.secondary }}
            accessible={true}
            accessibilityRole="text"
          >
            {errorMessage}
          </Text>
          
          {onRetry && (
            <Button
              size="sm"
              variant="outline"
              onPress={onRetry}
              className="mt-2"
              style={{
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.card.background,
              }}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Try again"
              accessibilityHint="Double tap to retry the failed action"
            >
              <ButtonText style={{ color: theme.colors.text.primary }}>
                Try Again
              </ButtonText>
            </Button>
          )}
        </VStack>
      </Alert>
    </VStack>
  );
});

ErrorState.displayName = 'ErrorState'; 