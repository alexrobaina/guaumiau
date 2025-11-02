import {useQuery, UseQueryOptions} from '@tanstack/react-query';
import {providerService} from '@/services/api/provider.service';
import {Provider} from '@/types/provider.types';

export const useProvider = (
  id: string,
  options?: Omit<UseQueryOptions<Provider, Error>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery<Provider, Error>({
    queryKey: ['provider', id],
    queryFn: () => providerService.getProvider(id),
    enabled: !!id,
    ...options,
  });
};
