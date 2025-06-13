import { apiClient } from '@/lib/api-config';
import type { MoviesResponse } from '@/types/movie';

export async function fetchPopularMovies(page: number = 1): Promise<MoviesResponse> {
  const response = await apiClient.get<MoviesResponse>('/movie/popular', {
    params: { page },
  });
  
  return response.data;
}

export async function fetchTrendingMovies(
  timeWindow: 'day' | 'week' = 'week',
  page: number = 1
): Promise<MoviesResponse> {
  const response = await apiClient.get<MoviesResponse>(`/trending/movie/${timeWindow}`, {
    params: { page },
  });
  
  return response.data;
}

export async function fetchMovieDetails(movieId: number) {
  const response = await apiClient.get(`/movie/${movieId}`);
  return response.data;
} 