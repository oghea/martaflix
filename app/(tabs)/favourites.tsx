import { EmptyState } from '@/components/empty-state';
import { MovieCard } from '@/components/movie-card';
import { useFavorites } from '@/hooks/use-favorites';
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

export default function FavouritesScreen() {
  const { theme } = useTheme();
  const { favorites, isLoading, favoritesCount } = useFavorites();

  const handleMoviePress = useCallback((movieId: number) => {
    router.push(`/movie/${movieId}`);
  }, []);

  const renderMovieItem = useCallback(
    ({ item }: { item: any }) => (
      <MovieCard
        movie={item}
        onPress={handleMoviePress}
      />
    ),
    [handleMoviePress]
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center' 
        }}>
          <Text style={{ 
            color: theme.colors.text.secondary,
            fontSize: 16 
          }}>
            Loading favorites...
          </Text>
        </View>
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
          {favoritesCount > 0 && (
            <Text
              style={{
                fontSize: 14,
                color: theme.colors.text.secondary,
                marginTop: 4,
              }}
            >
              {favoritesCount} movie{favoritesCount !== 1 ? 's' : ''} saved
            </Text>
          )}
        </View>

        {/* Content */}
        {renderContent()}
      </View>
    </SafeAreaView>
  );
} 