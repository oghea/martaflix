import type { Movie } from '@/types/movie';
import { act, renderHook } from '@testing-library/react-native';
import { useFavoritesStore } from '../favorites-store';
import { storageUtils } from '../storage';

// Mock the storage utility
jest.mock('../storage', () => ({
  storageUtils: {
    get: jest.fn(),
    set: jest.fn(),
    remove: jest.fn(),
    has: jest.fn(),
  },
  STORAGE_KEYS: {
    FAVORITES: 'favorites',
  },
}));

const mockStorageUtils = storageUtils as jest.Mocked<typeof storageUtils>;

describe('useFavoritesStore', () => {
  const mockMovie: Movie = {
    id: 1,
    title: 'Test Movie',
    overview: 'A test movie description',
    poster_path: '/test-poster.jpg',
    backdrop_path: '/test-backdrop.jpg',
    release_date: '2023-01-01',
    vote_average: 8.5,
    vote_count: 1000,
    popularity: 100,
    adult: false,
    genre_ids: [1, 2, 3],
    original_language: 'en',
    original_title: 'Test Movie',
    video: false,
  };

  const mockMovie2: Movie = {
    ...mockMovie,
    id: 2,
    title: 'Test Movie 2',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the store state
    useFavoritesStore.setState({ favorites: [], isLoading: false });
  });

  describe('initializeFavorites', () => {
    it('should load favorites from storage', () => {
      const savedFavorites = [mockMovie];
      mockStorageUtils.get.mockReturnValue(savedFavorites);

      const { result } = renderHook(() => useFavoritesStore());

      act(() => {
        result.current.initializeFavorites();
      });

      expect(mockStorageUtils.get).toHaveBeenCalledWith('favorites');
      expect(result.current.favorites).toEqual(savedFavorites);
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle empty storage', () => {
      mockStorageUtils.get.mockReturnValue(null);

      const { result } = renderHook(() => useFavoritesStore());

      act(() => {
        result.current.initializeFavorites();
      });

      expect(result.current.favorites).toEqual([]);
      expect(result.current.isLoading).toBe(false);
    });

    it('should set loading state during initialization', () => {
      const { result } = renderHook(() => useFavoritesStore());

      act(() => {
        result.current.initializeFavorites();
      });

      expect(result.current.isLoading).toBe(false); // Should be false after completion
    });
  });

  describe('addToFavorites', () => {
    it('should add a movie to favorites', () => {
      const { result } = renderHook(() => useFavoritesStore());

      act(() => {
        result.current.addToFavorites(mockMovie);
      });

      expect(result.current.favorites).toContain(mockMovie);
      expect(mockStorageUtils.set).toHaveBeenCalledWith('favorites', [mockMovie]);
    });

    it('should not add duplicate movies', () => {
      const { result } = renderHook(() => useFavoritesStore());

      act(() => {
        result.current.addToFavorites(mockMovie);
        result.current.addToFavorites(mockMovie); // Try to add the same movie again
      });

      expect(result.current.favorites).toHaveLength(1);
      expect(result.current.favorites[0]).toEqual(mockMovie);
    });

    it('should add multiple different movies', () => {
      const { result } = renderHook(() => useFavoritesStore());

      act(() => {
        result.current.addToFavorites(mockMovie);
        result.current.addToFavorites(mockMovie2);
      });

      expect(result.current.favorites).toHaveLength(2);
      expect(result.current.favorites).toContain(mockMovie);
      expect(result.current.favorites).toContain(mockMovie2);
    });
  });

  describe('removeFromFavorites', () => {
    it('should remove a movie from favorites', () => {
      const { result } = renderHook(() => useFavoritesStore());

      // Add movie first
      act(() => {
        result.current.addToFavorites(mockMovie);
        result.current.addToFavorites(mockMovie2);
      });

      expect(result.current.favorites).toHaveLength(2);

      // Remove one movie
      act(() => {
        result.current.removeFromFavorites(mockMovie.id);
      });

      expect(result.current.favorites).toHaveLength(1);
      expect(result.current.favorites).not.toContain(mockMovie);
      expect(result.current.favorites).toContain(mockMovie2);
    });

    it('should handle removing non-existent movie', () => {
      const { result } = renderHook(() => useFavoritesStore());

      act(() => {
        result.current.addToFavorites(mockMovie);
      });

      const initialLength = result.current.favorites.length;

      act(() => {
        result.current.removeFromFavorites(999); // Non-existent ID
      });

      expect(result.current.favorites).toHaveLength(initialLength);
    });
  });

  describe('toggleFavorite', () => {
    it('should add movie if not in favorites', () => {
      const { result } = renderHook(() => useFavoritesStore());

      act(() => {
        result.current.toggleFavorite(mockMovie);
      });

      expect(result.current.favorites).toContain(mockMovie);
    });

    it('should remove movie if already in favorites', () => {
      const { result } = renderHook(() => useFavoritesStore());

      // Add movie first
      act(() => {
        result.current.addToFavorites(mockMovie);
      });

      expect(result.current.favorites).toContain(mockMovie);

      // Toggle should remove it
      act(() => {
        result.current.toggleFavorite(mockMovie);
      });

      expect(result.current.favorites).not.toContain(mockMovie);
    });
  });

  describe('isFavorite', () => {
    it('should return true for favorited movies', () => {
      const { result } = renderHook(() => useFavoritesStore());

      act(() => {
        result.current.addToFavorites(mockMovie);
      });

      expect(result.current.isFavorite(mockMovie.id)).toBe(true);
    });

    it('should return false for non-favorited movies', () => {
      const { result } = renderHook(() => useFavoritesStore());

      expect(result.current.isFavorite(mockMovie.id)).toBe(false);
    });
  });

  describe('clearFavorites', () => {
    it('should clear all favorites', () => {
      const { result } = renderHook(() => useFavoritesStore());

      // Add some movies
      act(() => {
        result.current.addToFavorites(mockMovie);
        result.current.addToFavorites(mockMovie2);
      });

      expect(result.current.favorites).toHaveLength(2);

      // Clear all
      act(() => {
        result.current.clearFavorites();
      });

      expect(result.current.favorites).toHaveLength(0);
      expect(mockStorageUtils.remove).toHaveBeenCalledWith('favorites');
    });
  });

  describe('persistence', () => {
    it('should save to storage when adding favorites', () => {
      const { result } = renderHook(() => useFavoritesStore());

      act(() => {
        result.current.addToFavorites(mockMovie);
      });

      expect(mockStorageUtils.set).toHaveBeenCalledWith('favorites', [mockMovie]);
    });

    it('should save to storage when removing favorites', () => {
      const { result } = renderHook(() => useFavoritesStore());

      // Add two movies
      act(() => {
        result.current.addToFavorites(mockMovie);
        result.current.addToFavorites(mockMovie2);
      });

      // Remove one
      act(() => {
        result.current.removeFromFavorites(mockMovie.id);
      });

      expect(mockStorageUtils.set).toHaveBeenLastCalledWith('favorites', [mockMovie2]);
    });
  });
}); 