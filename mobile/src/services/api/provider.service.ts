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
    console.log('🌐 Making API call to /providers with params:', params);
    const response = await client.get<PaginatedProvidersResponse>('/providers', {
      params,
    });
    console.log('🌐 API response status:', response.status, 'Total providers:', response.data.total);
    return response.data;
  },

  /**
   * Get a single provider by ID
   */
  getProvider: async (id: string): Promise<Provider> => {
    console.log('🌐 Making API call to /providers/:id with id:', id);
    const response = await client.get<Provider>(`/providers/${id}`);
    console.log('🌐 API response status:', response.status, 'Provider:', response.data.user.firstName);
    return response.data;
  },
};
