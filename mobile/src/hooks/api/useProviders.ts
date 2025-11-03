import {useQuery, UseQueryOptions} from '@tanstack/react-query';
import {providerService} from '@/services/api/provider.service';
import {
  PaginatedProvidersResponse,
  ProviderQueryParams,
} from '@/types/provider.types';

export const useProviders = (
  params?: ProviderQueryParams,
  options?: Omit<
    UseQueryOptions<PaginatedProvidersResponse, Error>,
    'queryKey' | 'queryFn'
  >,
) => {
  // Create a stable query key by serializing params in a consistent order
  const queryKey = ['providers', JSON.stringify(params || {})];

  return useQuery<PaginatedProvidersResponse, Error>({
    queryKey,
    queryFn: () => providerService.getProviders(params),
    ...options,
  });
};
