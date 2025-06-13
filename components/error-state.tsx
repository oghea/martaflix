import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useTheme } from '@/hooks/use-theme';
import * as React from 'react';

type Props = {
  error: Error | null;
  onRetry?: () => void;
  title?: string;
  message?: string;
};

export function ErrorState({ 
  error, 
  onRetry, 
  title = 'Something went wrong',
  message 
}: Props) {
  const { theme } = useTheme();
  const errorMessage = message || error?.message || 'An unexpected error occurred';

  return (
    <View className="flex-1 items-center justify-center p-6">
      <Alert 
        className="w-full max-w-sm"
        style={{ 
          backgroundColor: theme.colors.card.background,
          borderColor: theme.colors.border,
        }}
      >
        <View className="items-center">
          <Heading 
            size="md" 
            className="mb-2 text-center"
            style={{ color: '#EF4444' }}
          >
            {title}
          </Heading>
          
          <Text 
            className="mb-4 text-center"
            style={{ color: theme.colors.text.secondary }}
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
            >
              <Text style={{ color: theme.colors.text.primary }}>Try Again</Text>
            </Button>
          )}
        </View>
      </Alert>
    </View>
  );
} 