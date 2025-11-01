import apiClient from './client';
import {
  CreatePetRequest,
  UpdatePetRequest,
  UpdateMedicalInfoRequest,
  UpdateBehaviorInfoRequest,
  AddPhotoRequest,
  RemovePhotoRequest,
  PetResponse,
  PetsListResponse,
} from '@/types/pet.types';

/**
 * Pet Service - All pet management related API calls
 */
export const petService = {
  /**
   * Create a new pet
   * POST /pets
   */
  create: async (data: CreatePetRequest): Promise<PetResponse> => {
    const response = await apiClient.post<PetResponse>('/pets', data);
    return response.data;
  },

  /**
   * Get all pets for current user
   * GET /pets
   */
  getAll: async (): Promise<PetsListResponse> => {
    const response = await apiClient.get<PetsListResponse>('/pets');
    return response.data;
  },

  /**
   * Get a specific pet by ID
   * GET /pets/:id
   */
  getById: async (id: string): Promise<PetResponse> => {
    const response = await apiClient.get<PetResponse>(`/pets/${id}`);
    return response.data;
  },

  /**
   * Update a pet
   * PATCH /pets/:id
   */
  update: async (id: string, data: UpdatePetRequest): Promise<PetResponse> => {
    const response = await apiClient.patch<PetResponse>(`/pets/${id}`, data);
    return response.data;
  },

  /**
   * Delete a pet
   * DELETE /pets/:id
   */
  delete: async (id: string): Promise<{message: string}> => {
    const response = await apiClient.delete<{message: string}>(`/pets/${id}`);
    return response.data;
  },

  /**
   * Add a photo to a pet
   * POST /pets/:id/photos
   */
  addPhoto: async (id: string, data: AddPhotoRequest): Promise<PetResponse> => {
    const response = await apiClient.post<PetResponse>(
      `/pets/${id}/photos`,
      data,
    );
    return response.data;
  },

  /**
   * Remove a photo from a pet
   * DELETE /pets/:id/photos
   */
  removePhoto: async (
    id: string,
    data: RemovePhotoRequest,
  ): Promise<PetResponse> => {
    const response = await apiClient.delete<PetResponse>(
      `/pets/${id}/photos`,
      {data},
    );
    return response.data;
  },

  /**
   * Update pet medical information
   * PATCH /pets/:id/medical
   */
  updateMedicalInfo: async (
    id: string,
    data: UpdateMedicalInfoRequest,
  ): Promise<PetResponse> => {
    const response = await apiClient.patch<PetResponse>(
      `/pets/${id}/medical`,
      data,
    );
    return response.data;
  },

  /**
   * Update pet behavior information
   * PATCH /pets/:id/behavior
   */
  updateBehaviorInfo: async (
    id: string,
    data: UpdateBehaviorInfoRequest,
  ): Promise<PetResponse> => {
    const response = await apiClient.patch<PetResponse>(
      `/pets/${id}/behavior`,
      data,
    );
    return response.data;
  },
};
