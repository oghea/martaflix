import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { MovieCard } from '@/components/movie-card';
import { MovieSkeletonList } from '@/components/movie-skeleton';
import { FlatList } from '@/components/ui/flat-list';
import { Heading } from '@/components/ui/heading';
import { RefreshControl } from '@/components/ui/refresh-control';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { Spinner } from '@/components/ui/spinner';
import { StatusBar } from '@/components/ui/status-bar';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { VStack } from '@/components/ui/vstack';
import { useInfinitePopularMovies } from '@/hooks/use-movies';
import { useTheme } from '@/hooks/use-theme';
import type { Movie } from '@/types/movie';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { ListRenderItem } from 'react-native';

// Memoized Movie Card Component for performance optimization
const MemoizedMovieCard = React.memo(({ 
  movie, 
  onPress 
}: { 
  movie: Movie; 
  onPress: (movieId: number) => void;
}) => {
  return (
    <MovieCard 
      movie={movie} 
      onPress={onPress}
    />
  );
});

MemoizedMovieCard.displayName = 'MemoizedMovieCard';

export default function DiscoverScreen(): React.JSX.Element {
  const router = useRouter();
  const { theme } = useTheme();
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  
  const {
    data,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
  } = useInfinitePopularMovies();

  // Flatten all pages into a single array
  const movies = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.results) ?? [];
  }, [data]);

  const handleMoviePress = React.useCallback((movieId: number) => {
    router.push(`/movie/${movieId}`);
  }, [router]);

  const handleRetry = React.useCallback(() => {
    refetch();
  }, [refetch]);

  const handleRefresh = React.useCallback(async () => {
    try {
      // Trigger haptic feedback
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      setIsRefreshing(true);
      await refetch();
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  const handleLoadMore = React.useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderMovie: ListRenderItem<Movie> = React.useCallback(
    ({ item }) => <MemoizedMovieCard movie={item} onPress={handleMoviePress} />,
    [handleMoviePress]
  );

  const keyExtractor = React.useCallback((item: Movie) => item.id.toString(), []);

  const renderFooter = React.useCallback(() => {
    if (isFetchingNextPage) {
      return (
        <VStack 
          className="py-8 items-center"
          accessible={true}
          accessibilityRole="progressbar"
          accessibilityLabel="Loading more movies"
        >
          <Spinner size="small" />
          <Text 
            size="sm"
            className="mt-3 font-medium"
            style={{ color: theme.colors.text.secondary }}
          >
            Loading more movies...
          </Text>
        </VStack>
      );
    }
    return <View className="pb-6" />;
  }, [isFetchingNextPage, theme.colors.text.secondary]);

  const renderHeader = React.useCallback(() => (
    <View 
      className="px-4 pb-6 pt-4"
      accessible={true}
      accessibilityRole="header"
    >
      <VStack space="xs" className="mb-3">
        <Heading 
          size="2xl" 
          className="font-bold"
          style={{ 
            color: theme.colors.text.primary,
            letterSpacing: -0.5
          }}
          accessibilityRole="heading"
          accessibilityLevel={1}
        >
          Popular Movies
        </Heading>
        <Text 
          size="md"
          className="font-medium"
          style={{ color: theme.colors.text.secondary }}
          accessibilityRole="text"
        >
          Discover the most popular movies right now
        </Text>
      </VStack>
    </View>
  ), [theme.colors.text.primary, theme.colors.text.secondary]);

  // Enhanced refresh control with proper accessibility
  const refreshControl = React.useMemo(() => (
    <RefreshControl
      refreshing={isRefreshing || isRefetching}
      onRefresh={handleRefresh}
      colors={[theme.colors.primary]} // Android
      tintColor={theme.colors.primary} // iOS
      title="Pull to refresh"
      titleColor={theme.colors.text.secondary}
      progressBackgroundColor={theme.colors.surface}
      progressViewOffset={0}
      accessible={true}
      accessibilityLabel="Pull to refresh movies"
      accessibilityHint="Pull down to refresh the movie list"
    />
  ), [isRefreshing, isRefetching, handleRefresh, theme.colors.primary, theme.colors.text.secondary, theme.colors.surface]);

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView 
        className="flex-1"
        style={{ backgroundColor: theme.colors.background }}
      >
        <StatusBar
          barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={theme.colors.background}
        />
        <VStack className="flex-1">
          {renderHeader()}
          <MovieSkeletonList count={6} />
        </VStack>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView 
        className="flex-1"
        style={{ backgroundColor: theme.colors.background }}
      >
        <StatusBar
          barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={theme.colors.background}
        />
        <VStack className="flex-1">
          {renderHeader()}
          <ErrorState
            error={error}
            onRetry={handleRetry}
            title="Failed to load movies"
            message="Please check your internet connection and try again."
          />
        </VStack>
      </SafeAreaView>
    );
  }

  // Empty state
  if (!movies.length && !isRefreshing && !isRefetching) {
    return (
      <SafeAreaView 
        className="flex-1"
        style={{ backgroundColor: theme.colors.background }}
      >
        <StatusBar
          barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={theme.colors.background}
        />
        <VStack className="flex-1">
          {renderHeader()}
          <EmptyState />
        </VStack>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView 
      className="flex-1"
      style={{ backgroundColor: theme.colors.background }}
    >
      <StatusBar
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <FlatList
        data={movies}
        renderItem={renderMovie}
        keyExtractor={keyExtractor}
        numColumns={2}
        contentContainerStyle={{ 
          paddingBottom: 32,
          paddingHorizontal: 16,
        }}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={refreshControl}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={null}
        columnWrapperStyle={{ 
          justifyContent: 'space-between',
        }}
        // Performance optimizations
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        windowSize={10}
        getItemLayout={undefined} // Let FlatList calculate for numColumns > 1
        // Accessibility
        accessible={true}
        accessibilityRole="list"
        accessibilityLabel="Popular movies list"
        accessibilityHint="Scroll to browse popular movies. Pull down to refresh."
      />
    </SafeAreaView>
  );
} 