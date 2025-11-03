import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { authService } from '@/services/api/auth.service';
import { MeResponse, ApiError, User } from '@/types/auth.types';

/**
 * Custom hook for getting the current authenticated user data
 * This is an alias for useMe with better semantics for user profile screens
 *
 * @param enabled - Whether the query should run (default: true)
 * @returns React Query query object with user data
 *
 * @example
 * const { data, isLoading, error, refetch } = useUser();
 *
 * if (isLoading) return <Spinner />;
 * if (error) return <ErrorView />;
 *
 * return <Text>Welcome, {data.user.firstName}!</Text>;
 */
export const useUser = (
  enabled: boolean = true,
): UseQueryResult<MeResponse, AxiosError<ApiError>> => {
  return useQuery<MeResponse, AxiosError<ApiError>>({
    queryKey: ['auth', 'me'],
    queryFn: () => authService.me(),
    enabled,
    retry: 1, // Retry once on failure
    staleTime: 1000 * 60 * 5, // 5 minutes - user data doesn't change frequently
    gcTime: 1000 * 60 * 10, // 10 minutes cache time
  });
};
