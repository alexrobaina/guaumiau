import {useQuery, UseQueryResult} from '@tanstack/react-query';
import {AxiosError} from 'axios';
import {authService} from '@/services/api/auth.service';
import {MeResponse, ApiError} from '@/types/auth.types';

/**
 * Custom hook for getting current authenticated user
 * @param enabled - Whether the query should run (default: true)
 * @returns React Query query object
 */
export const useMe = (
  enabled: boolean = true,
): UseQueryResult<MeResponse, AxiosError<ApiError>> => {
  return useQuery<MeResponse, AxiosError<ApiError>>({
    queryKey: ['auth', 'me'],
    queryFn: () => authService.me(),
    enabled,
    retry: false, // Don't retry on 401 errors
  });
};

/**
 * Hook Usage Example:
 *
 * const { data, isLoading, isError, error } = useMe();
 *
 * if (isLoading) return <Spinner />;
 * if (isError) return <Text>Not authenticated</Text>;
 *
 * return <Text>Welcome, {data.user.username}!</Text>;
 */
