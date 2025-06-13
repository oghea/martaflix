import type { Movie } from '@/types/movie';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { STORAGE_KEYS, storageUtils } from './storage';

type FavoritesState = {
  favorites: Movie[];
  isLoading: boolean;
};

type FavoritesActions = {
  initializeFavorites: () => void;
  addToFavorites: (movie: Movie) => void;
  removeFromFavorites: (movieId: number) => void;
  toggleFavorite: (movie: Movie) => void;
  isFavorite: (movieId: number) => boolean;
  clearFavorites: () => void;
};

export const useFavoritesStore = create<FavoritesState & FavoritesActions>()(
  devtools(
    (set, get) => ({
      // State
      favorites: [],
      isLoading: false,

      // Actions
      initializeFavorites: () => {
        set({ isLoading: true });
        const savedFavorites = storageUtils.get<Movie[]>(STORAGE_KEYS.FAVORITES) || [];
        set({ favorites: savedFavorites, isLoading: false });
      },

      addToFavorites: (movie: Movie) => {
        const { favorites } = get();
        
        // Check if movie is already in favorites
        if (favorites.some(fav => fav.id === movie.id)) {
          return;
        }

        const updatedFavorites = [...favorites, movie];
        set({ favorites: updatedFavorites });
        storageUtils.set(STORAGE_KEYS.FAVORITES, updatedFavorites);
      },

      removeFromFavorites: (movieId: number) => {
        const { favorites } = get();
        const updatedFavorites = favorites.filter(movie => movie.id !== movieId);
        set({ favorites: updatedFavorites });
        storageUtils.set(STORAGE_KEYS.FAVORITES, updatedFavorites);
      },

      toggleFavorite: (movie: Movie) => {
        const { favorites, addToFavorites, removeFromFavorites } = get();
        const isFavorite = favorites.some(fav => fav.id === movie.id);
        
        if (isFavorite) {
          removeFromFavorites(movie.id);
        } else {
          addToFavorites(movie);
        }
      },

      isFavorite: (movieId: number) => {
        const { favorites } = get();
        return favorites.some(movie => movie.id === movieId);
      },

      clearFavorites: () => {
        set({ favorites: [] });
        storageUtils.remove(STORAGE_KEYS.FAVORITES);
      },
    }),
    {
      name: 'favorites-store',
    }
  )
); 