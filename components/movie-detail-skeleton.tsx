import { HStack } from '@/components/ui/hstack';
import { ScrollView } from '@/components/ui/scroll-view';
import { Skeleton } from '@/components/ui/skeleton';
import { VStack } from '@/components/ui/vstack';
import { useTheme } from '@/hooks/use-theme';
import * as React from 'react';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

// Memoized Skeleton Box Component
const SkeletonBox = React.memo(({ 
  width, 
  height, 
  className,
  style 
}: { 
  width: number | string; 
  height: number; 
  className?: string;
  style?: any;
}) => (
  <Skeleton 
    className={`rounded-lg ${className || ''}`}
    style={{
      width,
      height,
      ...style,
    }} 
  />
));

SkeletonBox.displayName = 'SkeletonBox';

// Memoized Cast Skeleton Item
const CastSkeletonItem = React.memo(() => (
  <VStack className="mr-3" space="xs">
    <SkeletonBox width={120} height={160} className="rounded-xl" />
    <SkeletonBox width={120} height={12} />
    <SkeletonBox width={80} height={10} />
  </VStack>
));

CastSkeletonItem.displayName = 'CastSkeletonItem';

// Memoized Movie Detail Skeleton Component
export const MovieDetailSkeleton = React.memo(() => {
  const { theme } = useTheme();

  const castSkeletons = React.useMemo(() => 
    Array.from({ length: 5 }, (_, index) => (
      <CastSkeletonItem key={index} />
    )),
    []
  );

  return (
    <ScrollView 
      className="flex-1"
      style={{ backgroundColor: theme.colors.background }}
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading movie details"
    >
      {/* Backdrop Skeleton */}
      <SkeletonBox width="100%" height={250} className="rounded-none" />
      
      <VStack className="p-4" space="lg">
        {/* Title and Rating */}
        <VStack space="sm">
          <SkeletonBox width="80%" height={28} />
          <SkeletonBox width="40%" height={20} />
        </VStack>
        
        {/* Genres */}
        <HStack space="sm">
          <SkeletonBox width={80} height={24} className="rounded-full" />
          <SkeletonBox width={90} height={24} className="rounded-full" />
          <SkeletonBox width={70} height={24} className="rounded-full" />
        </HStack>
        
        {/* Overview */}
        <VStack space="sm">
          <SkeletonBox width="20%" height={20} />
          <VStack space="xs">
            <SkeletonBox width="100%" height={16} />
            <SkeletonBox width="100%" height={16} />
            <SkeletonBox width="70%" height={16} />
          </VStack>
        </VStack>
        
        {/* Movie Info */}
        <VStack space="sm">
          <SkeletonBox width="30%" height={20} />
          <HStack className="justify-between" space="sm">
            <SkeletonBox width="45%" height={60} className="rounded-xl" />
            <SkeletonBox width="45%" height={60} className="rounded-xl" />
          </HStack>
        </VStack>
        
        {/* Cast Section */}
        <VStack space="sm">
          <SkeletonBox width="20%" height={20} />
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
            accessible={true}
            accessibilityRole="list"
            accessibilityLabel="Loading cast information"
          >
            {castSkeletons}
          </ScrollView>
        </VStack>
      </VStack>
    </ScrollView>
  );
});

MovieDetailSkeleton.displayName = 'MovieDetailSkeleton'; 