import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { MovieCard } from '@/components/movie-card';
import { MovieSkeletonList } from '@/components/movie-skeleton';
import { FlatList } from '@/components/ui/flat-list';
import { Input, InputField } from '@/components/ui/input';
import { StatusBar } from '@/components/ui/status-bar';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useDebounce } from '@/hooks/use-debounce';
import { useSearchMovies } from '@/hooks/use-movies';
import { useTheme } from '@/hooks/use-theme';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
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
    if (isLoading && debouncedQuery && debouncedQuery.length >= 2) {
      return <MovieSkeletonList />;
    }

    if (error) {
      return (
        <View className="flex-1">
          <ErrorState
            message="Failed to search movies"
            error={error}
            onRetry={handleRetry}
          />
        </View>
      );
    }

    if (!debouncedQuery || debouncedQuery.length < 2) {
      return (
        <View className="flex-1">
          <EmptyState
            title="Search Movies"
            message="Enter at least 2 characters to start searching"
          />
        </View>
      );
    }

    if (data && data.results && data.results.length === 0) {
      return (
        <View className="flex-1">
          <EmptyState
            title="No Results"
            message={`No movies found for "${debouncedQuery}"`}
          />
        </View>
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
      className="flex-1" 
      style={{ backgroundColor: theme.colors.background }}
      edges={['top']}
    >
      <StatusBar
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      
      <View className="flex-1">
        {/* Header */}
        <View 
          className="p-4 border-b"
          style={{ 
            backgroundColor: theme.colors.surface,
            borderBottomColor: theme.colors.border,
          }}
        >
          <Text 
            size="2xl" 
            className="font-bold mb-4"
            style={{ color: theme.colors.text.primary }}
          >
            Search Movies
          </Text>
          
          {/* Search Input */}
          <Input 
            variant="outline" 
            size="md" 
            style={{ backgroundColor: theme.colors.background }}
          >
            <InputField
              placeholder="Search for movies..."
              placeholderTextColor={theme.colors.text.tertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="search"
              style={{ color: theme.colors.text.primary }}
            />
          </Input>
        </View>

        {/* Content Area */}
        <View className="flex-1">
          {renderContent()}
        </View>
      </View>
    </SafeAreaView>
  );
} 