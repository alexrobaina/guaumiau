import client from './client';
import {
  Provider,
  PaginatedProvidersResponse,
  ProviderQueryParams,
} from '@/types/provider.types';

export const providerService = {
  /**
   * Get providers with optional filters
   */
  getProviders: async (
    params?: ProviderQueryParams,
  ): Promise<PaginatedProvidersResponse> => {
    const response = await client.get<PaginatedProvidersResponse>('/providers', {
      params,
    });
    return response.data;
  },

  /**
   * Get a single provider by ID
   */
  getProvider: async (id: string): Promise<Provider> => {
    const response = await client.get<Provider>(`/providers/${id}`);
    return response.data;
  },
};
