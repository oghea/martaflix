import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { MovieCard } from '@/components/movie-card';
import { MovieSkeletonList } from '@/components/movie-skeleton';
import { useDebounce } from '@/hooks/use-debounce';
import { useSearchMovies } from '@/hooks/use-movies';
import { useTheme } from '@/hooks/use-theme';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  StatusBar,
  Text,
  TextInput,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SEARCH_DEBOUNCE_MS = 300;

export default function SearchScreen() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS);

  const { data, isLoading, error, refetch } = useSearchMovies(debouncedQuery);

  const handleMoviePress = useCallback((movieId: number) => {
    router.push(`/movie/${movieId}`);
  }, []);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  const renderMovieItem = useCallback(
    ({ item, index }: { item: any; index: number }) => (
      <MovieCard
        movie={item}
        onPress={handleMoviePress}
      />
    ),
    [handleMoviePress]
  );

  const renderContent = () => {
    if (isLoading && debouncedQuery) {
      return <MovieSkeletonList />;
    }

    if (error) {
      return (
        <ErrorState
          message="Failed to search movies"
          error={error}
          onRetry={handleRetry}
        />
      );
    }

    if (!debouncedQuery) {
      return (
        <EmptyState
          title="Search Movies"
          message="Enter a movie title to start searching"
        />
      );
    }

    if (data && data.results && data.results.length === 0) {
      return (
        <EmptyState
          title="No Results"
          message={`No movies found for "${debouncedQuery}"`}
        />
      );
    }

    return (
      <FlatList
        data={data?.results || []}
        renderItem={renderMovieItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 100,
        }}
        columnWrapperStyle={{
          justifyContent: 'space-between',
        }}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      edges={['top']}
    >
      <StatusBar
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View
          style={{
            padding: 16,
            backgroundColor: theme.colors.surface,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: theme.colors.text.primary,
              marginBottom: 16,
            }}
          >
            Search Movies
          </Text>
          
          {/* Search Input */}
          <TextInput
            style={{
              backgroundColor: theme.colors.background,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: 16,
              color: theme.colors.text.primary,
              borderWidth: 1,
              borderColor: theme.colors.border,
            }}
            placeholder="Search for movies..."
            placeholderTextColor={theme.colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
          />
        </View>

        {/* Content */}
        {renderContent()}
      </View>
    </SafeAreaView>
  );
} 