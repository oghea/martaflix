import { fetchPopularMovies, fetchTrendingMovies } from '@/api/movies';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

export function usePopularMovies(page: number = 1) {
  return useQuery({
    queryKey: ['movies', 'popular', page],
    queryFn: () => fetchPopularMovies(page),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useInfinitePopularMovies() {
  return useInfiniteQuery({
    queryKey: ['movies', 'popular', 'infinite'],
    queryFn: ({ pageParam = 1 }) => fetchPopularMovies(pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useTrendingMovies(timeWindow: 'day' | 'week' = 'week', page: number = 1) {
  return useQuery({
    queryKey: ['movies', 'trending', timeWindow, page],
    queryFn: () => fetchTrendingMovies(timeWindow, page),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useInfiniteTrendingMovies(timeWindow: 'day' | 'week' = 'week') {
  return useInfiniteQuery({
    queryKey: ['movies', 'trending', timeWindow, 'infinite'],
    queryFn: ({ pageParam = 1 }) => fetchTrendingMovies(timeWindow, pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
} 