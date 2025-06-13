import { Skeleton } from '@/components/ui/skeleton';
import { View } from '@/components/ui/view';
import { useTheme } from '@/hooks/use-theme';
import * as React from 'react';
import { Dimensions, Platform } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const horizontalPadding = 16; // Total horizontal padding from screen edges
const cardSpacing = 12; // Space between cards
const cardWidth = (screenWidth - (horizontalPadding * 2) - cardSpacing) / 2;

export function MovieSkeleton() {
  const { theme } = useTheme();
  
  return (
    <View 
      style={{
        width: cardWidth,
        marginBottom: 16,
        backgroundColor: theme.colors.card.background,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.colors.card.border,
        // Enhanced shadow for better visibility
        ...Platform.select({
          ios: {
            shadowColor: theme.colors.shadow,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: theme.mode === 'dark' ? 0.3 : 0.15,
            shadowRadius: 8,
          },
          android: {
            elevation: 12,
          },
        }),
      }}
    >
      <Skeleton 
        className="w-full" 
        style={{ height: 140 }}
      />
      
      <View style={{ padding: 16 }}>
        <Skeleton className="mb-2 h-6 w-4/5 rounded-lg" />
        <Skeleton className="mb-2 h-4 w-2/5 rounded-md" />
        <Skeleton className="mb-3 h-5 w-16 rounded-full" />
        <Skeleton className="mb-1 h-3 w-full rounded-md" />
        <Skeleton className="mb-1 h-3 w-full rounded-md" />
        <Skeleton className="h-3 w-3/4 rounded-md" />
      </View>
    </View>
  );
}

type Props = {
  count?: number;
};

export function MovieSkeletonList({ count = 6 }: Props) {
  return (
    <View 
      className="flex-row flex-wrap"
      style={{ 
        paddingHorizontal: 16,
        justifyContent: 'space-between'
      }}
    >
      {Array.from({ length: count }, (_, index) => (
        <MovieSkeleton key={index} />
      ))}
    </View>
  );
} 