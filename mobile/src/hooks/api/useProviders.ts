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
  return useQuery<PaginatedProvidersResponse, Error>({
    queryKey: ['providers', params],
    queryFn: () => providerService.getProviders(params),
    ...options,
  });
};
