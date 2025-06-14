import { fetchMovieCredits, fetchMovieDetails } from '@/api/movies';
import { useQuery } from '@tanstack/react-query';

export function useMovieDetails(movieId: number) {
  return useQuery({
    queryKey: ['movie', movieId],
    queryFn: () => fetchMovieDetails(movieId),
    enabled: !!movieId,
  });
}

export function useMovieCredits(movieId: number) {
  return useQuery({
    queryKey: ['movie', movieId, 'credits'],
    queryFn: () => fetchMovieCredits(movieId),
    enabled: !!movieId,
  });
} 