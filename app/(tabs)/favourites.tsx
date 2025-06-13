import { EmptyState } from '@/components/empty-state';
import { MovieCard } from '@/components/movie-card';
import { useTheme } from '@/hooks/use-theme';
import { router } from 'expo-router';
import React, { useCallback } from 'react';
import {
    FlatList,
    StatusBar,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// TODO: Implement favourites storage with Zustand or AsyncStorage
const MOCK_FAVOURITES: any[] = [];

export default function FavouritesScreen() {
  const { theme } = useTheme();

  const handleMoviePress = useCallback((movieId: number) => {
    router.push(`/movie/${movieId}`);
  }, []);

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
    if (MOCK_FAVOURITES.length === 0) {
      return (
        <EmptyState
          title="No Favourites Yet"
          message="Add movies to your favourites to see them here"
        />
      );
    }

    return (
      <FlatList
        data={MOCK_FAVOURITES}
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
            }}
          >
            My Favourites
          </Text>
        </View>

        {/* Content */}
        {renderContent()}
      </View>
    </SafeAreaView>
  );
} 