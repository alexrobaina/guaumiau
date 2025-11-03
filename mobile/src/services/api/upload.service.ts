import axios from './client';

export interface UploadResponse {
  url: string;
}

/**
 * Upload a pet image to S3
 * @param imageUri - Local URI of the image to upload
 * @returns Promise with the uploaded image URL
 */
export const uploadPetImage = async (imageUri: string): Promise<UploadResponse> => {
  const formData = new FormData();

  // Extract filename from URI
  const filename = imageUri.split('/').pop() || 'image.jpg';

  // Determine mime type from extension
  const extension = filename.split('.').pop()?.toLowerCase();
  let mimeType = 'image/jpeg';
  if (extension === 'png') {
    mimeType = 'image/png';
  } else if (extension === 'webp') {
    mimeType = 'image/webp';
  }

  // Create file object for FormData
  const file = {
    uri: imageUri,
    type: mimeType,
    name: filename,
  } as any;

  formData.append('file', file);

  const response = await axios.post<UploadResponse>('/uploads/pet-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * Upload a user avatar to S3
 * @param imageUri - Local URI of the image to upload
 * @returns Promise with the uploaded image URL
 */
export const uploadAvatar = async (imageUri: string): Promise<UploadResponse> => {
  const formData = new FormData();

  // Extract filename from URI
  const filename = imageUri.split('/').pop() || 'avatar.jpg';

  // Determine mime type from extension
  const extension = filename.split('.').pop()?.toLowerCase();
  let mimeType = 'image/jpeg';
  if (extension === 'png') {
    mimeType = 'image/png';
  } else if (extension === 'webp') {
    mimeType = 'image/webp';
  }

  // Create file object for FormData
  const file = {
    uri: imageUri,
    type: mimeType,
    name: filename,
  } as any;

  formData.append('file', file);

  const response = await axios.post<UploadResponse>('/uploads/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
