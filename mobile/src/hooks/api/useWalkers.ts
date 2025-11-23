import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { walkersService, Walker, SearchWalkersParams } from '@/services/api/walkers.service'

interface ApiError {
  message: string
  statusCode: number
}

/**
 * Custom hook for searching walkers with filters
 * @param params Search parameters (location, distance, rating, etc.)
 * @returns React Query query object
 */
export const useWalkers = (
  params?: SearchWalkersParams,
): UseQueryResult<Walker[], AxiosError<ApiError>> => {
  return useQuery<Walker[], AxiosError<ApiError>>({
    queryKey: ['walkers', params],
    queryFn: async () => {
      console.log('[useWalkers] Searching walkers with params:', JSON.stringify(params, null, 2))
      const walkers = await walkersService.searchWalkers(params)
      console.log('[useWalkers] Found', walkers.length, 'walkers')
      return walkers
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Custom hook for fetching a single walker by ID
 * @param walkerId Walker ID
 * @returns React Query query object
 */
export const useWalker = (
  walkerId: string,
): UseQueryResult<Walker, AxiosError<ApiError>> => {
  return useQuery<Walker, AxiosError<ApiError>>({
    queryKey: ['walker', walkerId],
    queryFn: () => walkersService.getWalkerById(walkerId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!walkerId,
  })
}
