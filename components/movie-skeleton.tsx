import { HStack } from '@/components/ui/hstack';
import { Skeleton } from '@/components/ui/skeleton';
import { View } from '@/components/ui/view';
import { VStack } from '@/components/ui/vstack';
import { useTheme } from '@/hooks/use-theme';
import * as React from 'react';
import { Dimensions, Platform } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const horizontalPadding = 16; // Total horizontal padding from screen edges
const cardWidth = (screenWidth - (horizontalPadding * 2)) / 2 - 6; // Subtract small margin for spacing

// Memoized Movie Skeleton Component
const MovieSkeleton = React.memo(() => {
  const { theme } = useTheme();
  
  return (
    <View 
      className="mb-4 rounded-2xl border shadow-lg overflow-hidden"
      style={{
        width: cardWidth,
        backgroundColor: theme.colors.card.background,
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
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading movie"
    >
      <Skeleton 
        className="w-full rounded-none" 
        style={{ height: 140 }}
      />
      
      <VStack className="p-4" space="sm">
        <Skeleton className="h-6 w-4/5 rounded-lg" />
        <Skeleton className="h-4 w-2/5 rounded-md" />
        <Skeleton className="h-5 w-16 rounded-full" />
        <VStack space="xs">
          <Skeleton className="h-3 w-full rounded-md" />
          <Skeleton className="h-3 w-full rounded-md" />
          <Skeleton className="h-3 w-3/4 rounded-md" />
        </VStack>
      </VStack>
    </View>
  );
});

MovieSkeleton.displayName = 'MovieSkeleton';

type Props = {
  count?: number;
};

// Memoized Movie Skeleton List Component
export const MovieSkeletonList = React.memo(({ count = 6 }: Props) => {
  const skeletonItems = React.useMemo(() => 
    Array.from({ length: count }, (_, index) => (
      <MovieSkeleton key={index} />
    )),
    [count]
  );

  return (
    <HStack 
      className="px-4 flex-wrap justify-between"
      accessible={true}
      accessibilityRole="list"
      accessibilityLabel={`Loading ${count} movies`}
    >
      {skeletonItems}
    </HStack>
  );
});

MovieSkeletonList.displayName = 'MovieSkeletonList'; 