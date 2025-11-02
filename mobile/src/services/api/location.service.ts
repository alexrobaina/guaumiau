import apiClient from './client';

export interface UpdateLocationRequest {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  country?: string;
}

export interface UpdateLocationResponse {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  address: string | null;
  city: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  // ... other user fields
}

/**
 * Location API service
 */
export const locationService = {
  /**
   * Update the authenticated user's location
   */
  async updateLocation(data: UpdateLocationRequest): Promise<UpdateLocationResponse> {
    const response = await apiClient.patch<UpdateLocationResponse>('/auth/location', data);
    return response.data;
  },
};
