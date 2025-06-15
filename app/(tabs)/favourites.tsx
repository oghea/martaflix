import { EmptyState } from '@/components/empty-state';
import { MovieCard } from '@/components/movie-card';
import { FlatList } from '@/components/ui/flat-list';
import { Heading } from '@/components/ui/heading';
import { Spinner } from '@/components/ui/spinner';
import { StatusBar } from '@/components/ui/status-bar';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { VStack } from '@/components/ui/vstack';
import { useFavorites } from '@/hooks/use-favorites';
import { useTheme } from '@/hooks/use-theme';
import type { Movie } from '@/types/movie';
import { router } from 'expo-router';
import React, { useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

// Memoized Movie Card Component for performance optimization
const MemoizedFavoriteMovieCard = React.memo(({ 
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

MemoizedFavoriteMovieCard.displayName = 'MemoizedFavoriteMovieCard';

export default function FavouritesScreen() {
  const { theme } = useTheme();
  const { favorites, isLoading, favoritesCount } = useFavorites();

  const handleMoviePress = useCallback((movieId: number) => {
    router.push(`/movie/${movieId}`);
  }, []);

  const renderMovieItem = useCallback(
    ({ item }: { item: Movie }) => (
      <MemoizedFavoriteMovieCard
        movie={item}
        onPress={handleMoviePress}
      />
    ),
    [handleMoviePress]
  );

  const keyExtractor = useCallback((item: Movie) => `favorite-movie-${item.id}`, []);

  const renderHeader = useCallback(() => (
    <View
      className="p-4 border-b"
      style={{
        backgroundColor: theme.colors.surface,
        borderBottomColor: theme.colors.border,
      }}
      accessible={true}
      accessibilityRole="header"
    >
      <VStack space="xs">
        <Heading
          size="2xl"
          className="font-bold"
          style={{ color: theme.colors.text.primary }}
          accessibilityRole="heading"
          accessibilityLevel={1}
        >
          My Favourites
        </Heading>
        {favoritesCount > 0 && (
          <Text
            size="sm"
            className="font-medium"
            style={{ color: theme.colors.text.secondary }}
            accessibilityRole="text"
            accessibilityLabel={`${favoritesCount} favorite ${favoritesCount !== 1 ? 'movies' : 'movie'} saved`}
          >
            {favoritesCount} movie{favoritesCount !== 1 ? 's' : ''} saved
          </Text>
        )}
      </VStack>
    </View>
  ), [theme.colors.surface, theme.colors.border, theme.colors.text.primary, theme.colors.text.secondary, favoritesCount]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <VStack 
          className="flex-1 justify-center items-center"
          accessible={true}
          accessibilityRole="progressbar"
          accessibilityLabel="Loading favorite movies"
        >
          <Spinner size="large" />
          <Text
            size="md"
            className="mt-4 font-medium"
            style={{ color: theme.colors.text.secondary }}
          >
            Loading favorites...
          </Text>
        </VStack>
      );
    }

    if (favorites.length === 0) {
      return (
        <EmptyState
          title="No Favourites Yet"
          message="Add movies to your favourites to see them here. Tap the ❤️ icon on any movie card to add it to your favourites."
        />
      );
    }

    return (
      <FlatList
        data={favorites}
        renderItem={renderMovieItem}
        keyExtractor={keyExtractor}
        numColumns={2}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 100,
        }}
        columnWrapperStyle={{
          justifyContent: 'space-between',
        }}
        showsVerticalScrollIndicator={false}
        // Performance optimizations
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        windowSize={10}
        getItemLayout={undefined} // Let FlatList calculate for numColumns > 1
        // Accessibility
        accessible={true}
        accessibilityRole="list"
        accessibilityLabel="Favorite movies list"
        accessibilityHint="Scroll to browse your favorite movies"
      />
    );
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.colors.background }}
      edges={['top']}
    >
      <StatusBar
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      
      <VStack className="flex-1">
        {renderHeader()}
        {renderContent()}
      </VStack>
    </SafeAreaView>
  );
} 