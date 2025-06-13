import { apiClient } from '@/lib/api-config';
import { Movie, MoviesResponse } from '@/types/movie';

export async function fetchPopularMovies(page: number = 1): Promise<MoviesResponse> {
  const response = await apiClient.get('/movie/popular', {
    params: { page },
  });
  return response.data;
}

export async function fetchTrendingMovies(page: number = 1): Promise<MoviesResponse> {
  const response = await apiClient.get('/trending/movie/week', {
    params: { page },
  });
  return response.data;
}

export async function fetchMovieDetails(movieId: number): Promise<Movie> {
  const response = await apiClient.get(`/movie/${movieId}`);
  return response.data;
}

export async function searchMovies(query: string, page: number = 1): Promise<MoviesResponse> {
  const response = await apiClient.get('/search/movie', {
    params: { 
      query,
      page,
    },
  });
  return response.data;
} 