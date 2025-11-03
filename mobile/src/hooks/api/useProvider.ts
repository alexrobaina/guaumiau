import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { providerService } from '@/services/api/provider.service';
import { Provider } from '@/types/provider.types';

/**
 * Custom hook to fetch a single provider by ID
 *
 * @param id - Provider ID
 * @param options - Additional React Query options
 * @returns React Query result with provider data, loading, and error states
 *
 * @example
 * const { data: provider, isLoading, error, refetch } = useProvider(providerId);
 */
export const useProvider = (
  id: string,
  options?: Omit<UseQueryOptions<Provider, Error>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery<Provider, Error>({
    queryKey: ['provider', id],
    queryFn: () => providerService.getProvider(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes - provider data doesn't change frequently
    gcTime: 1000 * 60 * 10, // 10 minutes cache time
    retry: 2, // Retry failed requests twice
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    ...options,
  });
};
