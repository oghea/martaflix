import { fetchMovieCredits, fetchMovieDetails, fetchPersonCredits, fetchPersonDetails } from '@/api/movies';
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

export function usePersonDetails(personId: number) {
  return useQuery({
    queryKey: ['person', personId],
    queryFn: () => fetchPersonDetails(personId),
    enabled: !!personId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function usePersonCredits(personId: number) {
  return useQuery({
    queryKey: ['person', personId, 'credits'],
    queryFn: () => fetchPersonCredits(personId),
    enabled: !!personId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
} 