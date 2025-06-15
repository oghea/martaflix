import { HStack } from '@/components/ui/hstack';
import { View } from '@/components/ui/view';
import { VStack } from '@/components/ui/vstack';
import { useTheme } from '@/hooks/use-theme';
import * as React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';

// Memoized Skeleton Item Component
const SkeletonItem = React.memo(({ 
  width, 
  height, 
  borderRadius = 8,
  theme 
}: { 
  width: number | string; 
  height: number; 
  borderRadius?: number;
  theme: any;
}) => (
  <View
    style={{
      width,
      height,
      borderRadius,
      backgroundColor: theme.colors.placeholder.background,
    }}
    accessible={false}
  />
));

SkeletonItem.displayName = 'SkeletonItem';

// Memoized Detail Card Skeleton Component
const DetailCardSkeleton = React.memo(({ theme }: { theme: any }) => (
  <View 
    className="flex-1 min-w-[45%] mr-2 mb-2 p-4 rounded-xl border"
    style={{
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
    }}
  >
    <SkeletonItem width={60} height={12} theme={theme} />
    <View className="mt-2">
      <SkeletonItem width="80%" height={16} theme={theme} />
    </View>
  </View>
));

DetailCardSkeleton.displayName = 'DetailCardSkeleton';

export const CastDetailSkeleton = React.memo(() => {
  const { theme } = useTheme();

  return (
    <SafeAreaView 
      className="flex-1"
      style={{ backgroundColor: theme.colors.background }}
    >
      {/* Header */}
      <View 
        className="flex-row items-center justify-between p-4 border-b"
        style={{ borderBottomColor: theme.colors.border }}
      >
        <SkeletonItem width={40} height={40} borderRadius={20} theme={theme} />
        <SkeletonItem width={150} height={20} theme={theme} />
        <View style={{ width: 40 }} />
      </View>

      <ScrollView className="flex-1">
        <VStack className="p-4" space="lg">
          {/* Profile Section */}
          <HStack className="items-start" space="md">
            {/* Profile Image */}
            <SkeletonItem width={120} height={160} borderRadius={12} theme={theme} />

            {/* Basic Info */}
            <VStack className="flex-1" space="sm">
              <SkeletonItem width="90%" height={24} theme={theme} />
              <SkeletonItem width="70%" height={16} theme={theme} />
              <SkeletonItem width="60%" height={14} theme={theme} />
              <SkeletonItem width="80%" height={14} theme={theme} />
            </VStack>
          </HStack>

          {/* Biography Section */}
          <VStack space="sm">
            <SkeletonItem width={100} height={20} theme={theme} />
            <VStack space="xs">
              <SkeletonItem width="100%" height={14} theme={theme} />
              <SkeletonItem width="100%" height={14} theme={theme} />
              <SkeletonItem width="100%" height={14} theme={theme} />
              <SkeletonItem width="80%" height={14} theme={theme} />
            </VStack>
          </VStack>

          {/* Personal Details Section */}
          <VStack space="md">
            <SkeletonItem width={140} height={20} theme={theme} />
            
            <View className="flex-row flex-wrap">
              <DetailCardSkeleton theme={theme} />
              <DetailCardSkeleton theme={theme} />
              <DetailCardSkeleton theme={theme} />
              <DetailCardSkeleton theme={theme} />
            </View>
          </VStack>

          {/* Known For Section */}
          <VStack space="md">
            <SkeletonItem width={120} height={20} theme={theme} />
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 16 }}
            >
              {Array.from({ length: 5 }).map((_, index) => (
                <View key={index} className="mr-3" style={{ width: 140 }}>
                  <SkeletonItem width={140} height={190} borderRadius={12} theme={theme} />
                  <VStack className="mt-2" space="xs">
                    <SkeletonItem width="100%" height={14} theme={theme} />
                    <SkeletonItem width="80%" height={12} theme={theme} />
                  </VStack>
                </View>
              ))}
            </ScrollView>
          </VStack>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
});

 