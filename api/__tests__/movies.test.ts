import type { MovieCredits, MovieDetails, MoviesResponse } from '@/types/movie';
import axios from 'axios';
import { fetchMovieCredits, fetchMovieDetails, fetchPopularMovies, searchMovies } from '../movies';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock the API client
jest.mock('@/lib/api-config', () => ({
  apiClient: {
    get: jest.fn(),
  },
  getImageUrl: jest.fn((path: string, size: string) => `https://image.tmdb.org/t/p/${size}${path}`),
  IMAGE_SIZES: {
    poster: {
      small: 'w185',
      medium: 'w342',
      large: 'w500',
    },
    backdrop: {
      small: 'w300',
      medium: 'w780',
      large: 'w1280',
    },
  },
}));

// Import the mocked apiClient
import { apiClient } from '@/lib/api-config';
const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('Movies API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchPopularMovies', () => {
    const mockMoviesResponse: MoviesResponse = {
      page: 1,
      results: [
        {
          id: 1,
          title: 'Test Movie 1',
          overview: 'Test overview 1',
          poster_path: '/test1.jpg',
          backdrop_path: '/backdrop1.jpg',
          release_date: '2023-01-01',
          vote_average: 8.5,
          vote_count: 1000,
          popularity: 100,
          adult: false,
          genre_ids: [28, 12],
          original_language: 'en',
          original_title: 'Test Movie 1',
          video: false,
        },
        {
          id: 2,
          title: 'Test Movie 2',
          overview: 'Test overview 2',
          poster_path: '/test2.jpg',
          backdrop_path: '/backdrop2.jpg',
          release_date: '2023-02-01',
          vote_average: 7.8,
          vote_count: 800,
          popularity: 90,
          adult: false,
          genre_ids: [18, 35],
          original_language: 'en',
          original_title: 'Test Movie 2',
          video: false,
        },
      ],
      total_pages: 10,
      total_results: 200,
    };

    it('should fetch popular movies successfully', async () => {
      mockApiClient.get.mockResolvedValue({ data: mockMoviesResponse });

      const result = await fetchPopularMovies();

      expect(mockApiClient.get).toHaveBeenCalledWith('/movie/popular', {
        params: { page: 1 },
      });
      expect(result).toEqual(mockMoviesResponse);
    });

    it('should fetch popular movies with custom page', async () => {
      mockApiClient.get.mockResolvedValue({ data: mockMoviesResponse });

      await fetchPopularMovies(3);

      expect(mockApiClient.get).toHaveBeenCalledWith('/movie/popular', {
        params: { page: 3 },
      });
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Network Error';
      mockApiClient.get.mockRejectedValue(new Error(errorMessage));

      await expect(fetchPopularMovies()).rejects.toThrow(errorMessage);
    });
  });

  describe('fetchMovieDetails', () => {
    const mockMovieDetails: MovieDetails = {
      id: 1,
      title: 'Test Movie',
      overview: 'Detailed overview',
      poster_path: '/test.jpg',
      backdrop_path: '/backdrop.jpg',
      release_date: '2023-01-01',
      vote_average: 8.5,
      vote_count: 1000,
      popularity: 100,
      adult: false,
      original_language: 'en',
      original_title: 'Test Movie',
      video: false,
      genres: [
        { id: 28, name: 'Action' },
        { id: 12, name: 'Adventure' },
      ],
      homepage: 'https://example.com',
      imdb_id: 'tt1234567',
      production_companies: [
        {
          id: 1,
          logo_path: '/company.jpg',
          name: 'Test Studio',
          origin_country: 'US',
        },
      ],
      production_countries: [
        {
          iso_3166_1: 'US',
          name: 'United States',
        },
      ],
      runtime: 120,
      spoken_languages: [
        {
          english_name: 'English',
          iso_639_1: 'en',
          name: 'English',
        },
      ],
      status: 'Released',
      tagline: 'An amazing movie',
      budget: 50000000,
      revenue: 150000000,
    };

    it('should fetch movie details successfully', async () => {
      mockApiClient.get.mockResolvedValue({ data: mockMovieDetails });

      const result = await fetchMovieDetails(1);

      expect(mockApiClient.get).toHaveBeenCalledWith('/movie/1');
      expect(result).toEqual(mockMovieDetails);
    });

    it('should handle non-existent movie', async () => {
      const errorResponse = {
        response: {
          status: 404,
          data: { status_message: 'The resource you requested could not be found.' },
        },
      };
      mockApiClient.get.mockRejectedValue(errorResponse);

      await expect(fetchMovieDetails(999)).rejects.toEqual(errorResponse);
    });
  });

  describe('fetchMovieCredits', () => {
    const mockCredits: MovieCredits = {
      cast: [
        {
          id: 1,
          name: 'John Doe',
          character: 'Hero',
          profile_path: '/john.jpg',
          order: 0,
        },
        {
          id: 2,
          name: 'Jane Smith',
          character: 'Villain',
          profile_path: '/jane.jpg',
          order: 1,
        },
      ],
      crew: [
        {
          id: 3,
          name: 'Director Name',
          job: 'Director',
          department: 'Directing',
          profile_path: '/director.jpg',
        },
        {
          id: 4,
          name: 'Producer Name',
          job: 'Producer',
          department: 'Production',
          profile_path: '/producer.jpg',
        },
      ],
    };

    it('should fetch movie credits successfully', async () => {
      mockApiClient.get.mockResolvedValue({ data: mockCredits });

      const result = await fetchMovieCredits(1);

      expect(mockApiClient.get).toHaveBeenCalledWith('/movie/1/credits');
      expect(result).toEqual(mockCredits);
    });

    it('should handle credits API error', async () => {
      const errorMessage = 'Credits not found';
      mockApiClient.get.mockRejectedValue(new Error(errorMessage));

      await expect(fetchMovieCredits(1)).rejects.toThrow(errorMessage);
    });
  });

  describe('searchMovies', () => {
    const mockSearchResponse: MoviesResponse = {
      page: 1,
      results: [
        {
          id: 100,
          title: 'Search Result Movie',
          overview: 'Found movie overview',
          poster_path: '/search.jpg',
          backdrop_path: '/search-backdrop.jpg',
          release_date: '2023-03-01',
          vote_average: 6.5,
          vote_count: 500,
          popularity: 75,
          adult: false,
          genre_ids: [18],
          original_language: 'en',
          original_title: 'Search Result Movie',
          video: false,
        },
      ],
      total_pages: 1,
      total_results: 1,
    };

    it('should search movies successfully', async () => {
      mockApiClient.get.mockResolvedValue({ data: mockSearchResponse });

      const result = await searchMovies('test query');

      expect(mockApiClient.get).toHaveBeenCalledWith('/search/movie', {
        params: {
          query: 'test query',
          page: 1,
        },
      });
      expect(result).toEqual(mockSearchResponse);
    });

    it('should search movies with custom page', async () => {
      mockApiClient.get.mockResolvedValue({ data: mockSearchResponse });

      await searchMovies('test query', 2);

      expect(mockApiClient.get).toHaveBeenCalledWith('/search/movie', {
        params: {
          query: 'test query',
          page: 2,
        },
      });
    });

    it('should handle empty search results', async () => {
      const emptyResponse: MoviesResponse = {
        page: 1,
        results: [],
        total_pages: 0,
        total_results: 0,
      };
      mockApiClient.get.mockResolvedValue({ data: emptyResponse });

      const result = await searchMovies('nonexistent movie');

      expect(result.results).toHaveLength(0);
      expect(result.total_results).toBe(0);
    });

    it('should handle search API errors', async () => {
      const errorMessage = 'Search failed';
      mockApiClient.get.mockRejectedValue(new Error(errorMessage));

      await expect(searchMovies('test')).rejects.toThrow(errorMessage);
    });
  });

  describe('API Error Handling', () => {
    it('should handle network errors consistently', async () => {
      const networkError = new Error('Network Error');
      mockApiClient.get.mockRejectedValue(networkError);

      await expect(fetchPopularMovies()).rejects.toThrow('Network Error');
      await expect(fetchMovieDetails(1)).rejects.toThrow('Network Error');
      await expect(fetchMovieCredits(1)).rejects.toThrow('Network Error');
      await expect(searchMovies('test')).rejects.toThrow('Network Error');
    });

    it('should handle HTTP error responses', async () => {
      const httpError = {
        response: {
          status: 500,
          data: { status_message: 'Internal Server Error' },
        },
      };
      mockApiClient.get.mockRejectedValue(httpError);

      await expect(fetchPopularMovies()).rejects.toEqual(httpError);
    });
  });
}); 