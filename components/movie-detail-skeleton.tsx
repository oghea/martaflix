import { View } from '@/components/ui/view';
import { useTheme } from '@/hooks/use-theme';
import * as React from 'react';
import { Dimensions, ScrollView } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export function MovieDetailSkeleton() {
  const { theme } = useTheme();

  const SkeletonBox = ({ width, height, style }: { width: number | string, height: number, style?: any }) => (
    <View 
      style={{
        width,
        height,
        backgroundColor: theme.colors.placeholder.background,
        borderRadius: 8,
        ...style,
      }} 
    />
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Backdrop Skeleton */}
      <SkeletonBox width="100%" height={250} style={{ borderRadius: 0 }} />
      
      <View style={{ padding: 16 }}>
        {/* Title and Rating */}
        <SkeletonBox width="80%" height={28} style={{ marginBottom: 8 }} />
        <SkeletonBox width="40%" height={20} style={{ marginBottom: 16 }} />
        
        {/* Genres */}
        <View style={{ flexDirection: 'row', marginBottom: 16 }}>
          <SkeletonBox width={80} height={24} style={{ marginRight: 8 }} />
          <SkeletonBox width={90} height={24} style={{ marginRight: 8 }} />
          <SkeletonBox width={70} height={24} />
        </View>
        
        {/* Overview */}
        <SkeletonBox width="20%" height={20} style={{ marginBottom: 8 }} />
        <SkeletonBox width="100%" height={16} style={{ marginBottom: 4 }} />
        <SkeletonBox width="100%" height={16} style={{ marginBottom: 4 }} />
        <SkeletonBox width="70%" height={16} style={{ marginBottom: 16 }} />
        
        {/* Movie Info */}
        <SkeletonBox width="30%" height={20} style={{ marginBottom: 8 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 }}>
          <SkeletonBox width="45%" height={60} />
          <SkeletonBox width="45%" height={60} />
        </View>
        
        {/* Cast Section */}
        <SkeletonBox width="20%" height={20} style={{ marginBottom: 12 }} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {Array.from({ length: 5 }).map((_, index) => (
            <View key={index} style={{ marginRight: 12 }}>
              <SkeletonBox width={120} height={160} style={{ marginBottom: 8 }} />
              <SkeletonBox width={120} height={12} style={{ marginBottom: 4 }} />
              <SkeletonBox width={80} height={10} />
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
} 