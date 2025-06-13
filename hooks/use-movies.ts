import { fetchPopularMovies, fetchTrendingMovies, searchMovies } from '@/api/movies';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

export const usePopularMovies = (page: number = 1) => {
  return useQuery({
    queryKey: ['movies', 'popular', page],
    queryFn: () => fetchPopularMovies(page),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useInfinitePopularMovies = () => {
  return useInfiniteQuery({
    queryKey: ['movies', 'popular', 'infinite'],
    queryFn: ({ pageParam = 1 }) => fetchPopularMovies(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export function useTrendingMovies(page: number = 1) {
  return useQuery({
    queryKey: ['movies', 'trending', page],
    queryFn: () => fetchTrendingMovies(page),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useInfiniteTrendingMovies() {
  return useInfiniteQuery({
    queryKey: ['movies', 'trending', 'infinite'],
    queryFn: ({ pageParam = 1 }) => fetchTrendingMovies(pageParam),
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

export const useSearchMovies = (query: string) => {
  return useQuery({
    queryKey: ['movies', 'search', query],
    queryFn: () => searchMovies(query),
    enabled: !!query && query.length >= 2,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}; 