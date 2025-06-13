import { useFavoritesStore } from '@/lib/favorites-store';
import type { Movie } from '@/types/movie';
import { useCallback } from 'react';

export function useFavorites() {
  const store = useFavoritesStore();

  const addToFavorites = useCallback((movie: Movie) => {
    store.addToFavorites(movie);
  }, [store]);

  const removeFromFavorites = useCallback((movieId: number) => {
    store.removeFromFavorites(movieId);
  }, [store]);

  const toggleFavorite = useCallback((movie: Movie) => {
    store.toggleFavorite(movie);
  }, [store]);

  const isFavorite = useCallback((movieId: number) => {
    return store.isFavorite(movieId);
  }, [store]);

  const clearAllFavorites = useCallback(() => {
    store.clearFavorites();
  }, [store]);

  return {
    favorites: store.favorites,
    isLoading: store.isLoading,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    clearAllFavorites,
    favoritesCount: store.favorites.length,
  };
} 