import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { MovieCard } from '@/components/movie-card';
import { MovieSkeletonList } from '@/components/movie-skeleton';
import { ThemeToggle } from '@/components/theme-toggle';
import { Heading } from '@/components/ui/heading';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useInfinitePopularMovies } from '@/hooks/use-movies';
import { useTheme } from '@/hooks/use-theme';
import type { Movie } from '@/types/movie';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { FlatList, ListRenderItem } from 'react-native';

export default function DiscoverScreen(): React.JSX.Element {
  const router = useRouter();
  const { theme } = useTheme();
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

  const handleLoadMore = React.useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderMovie: ListRenderItem<Movie> = React.useCallback(
    ({ item }) => <MovieCard movie={item} onPress={handleMoviePress} />,
    [handleMoviePress]
  );

  const renderFooter = React.useCallback(() => {
    if (isFetchingNextPage) {
      return (
        <View className="py-8 items-center">
          <Spinner size="small" />
          <Text style={{ 
            marginTop: 12, 
            fontSize: 14, 
            color: theme.colors.text.secondary,
            fontWeight: '500' 
          }}>
            Loading more movies...
          </Text>
        </View>
      );
    }
    return <View className="pb-6" />;
  }, [isFetchingNextPage, theme.colors.text.secondary]);

  const renderHeader = React.useCallback(() => (
    <View style={{ paddingHorizontal: 16, paddingBottom: 24, paddingTop: 16 }}>
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 12 
      }}>
        <View style={{ flex: 1 }}>
          <Heading 
            size="2xl" 
            style={{ 
              marginBottom: 8, 
              color: theme.colors.text.primary,
              fontWeight: 'bold',
              letterSpacing: -0.5
            }}
          >
            Popular Movies
          </Heading>
          <Text style={{ 
            color: theme.colors.text.secondary, 
            fontSize: 16, 
            fontWeight: '500' 
          }}>
            Discover the most popular movies right now
          </Text>
        </View>
        <ThemeToggle />
      </View>
    </View>
  ), [theme.colors.text.primary, theme.colors.text.secondary]);

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <View className="flex-1">
          {renderHeader()}
          <MovieSkeletonList count={6} />
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        {renderHeader()}
        <ErrorState
          error={error}
          onRetry={handleRetry}
          title="Failed to load movies"
          message="Please check your internet connection and try again."
        />
      </SafeAreaView>
    );
  }

  // Empty state
  if (!movies.length) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        {renderHeader()}
        <EmptyState />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <FlatList
        data={movies}
        renderItem={renderMovie}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{ 
          paddingBottom: 32,
          paddingHorizontal: 16,
        }}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshing={isRefetching}
        onRefresh={refetch}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={null}
        columnWrapperStyle={{ 
          justifyContent: 'space-between',
        }}
      />
    </SafeAreaView>
  );
} 