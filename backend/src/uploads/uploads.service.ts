import { Injectable, BadRequestException } from '@nestjs/common';
import { S3Service } from '../s3/s3.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadsService {
  constructor(private s3Service: S3Service) {}

  async uploadPetImage(
    file: Express.Multer.File,
    userId: string,
  ): Promise<{ url: string }> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only JPEG, PNG, and WebP images are allowed',
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size too large. Maximum size is 5MB');
    }

    // Generate unique filename
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `pets/${userId}/${uuidv4()}.${fileExtension}`;

    // Upload to S3
    await this.s3Service.uploadFile(fileName, file.buffer, file.mimetype);

    // Return the file URL (for now, just return the key)
    // In production, this would be the full S3 URL or CloudFront URL
    const url = `/uploads/${fileName}`;

    return { url };
  }

  async uploadAvatar(
    file: Express.Multer.File,
    userId: string,
  ): Promise<{ url: string }> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only JPEG, PNG, and WebP images are allowed',
      );
    }

    // Validate file size (2MB max for avatars)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size too large. Maximum size is 2MB');
    }

    // Generate unique filename
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `avatars/${userId}/${uuidv4()}.${fileExtension}`;

    // Upload to S3
    await this.s3Service.uploadFile(fileName, file.buffer, file.mimetype);

    // Return the file URL
    const url = `/uploads/${fileName}`;

    return { url };
  }

  async getFile(key: string): Promise<Buffer> {
    return await this.s3Service.getFile(key);
  }

  async deleteFile(key: string): Promise<void> {
    // Remove '/uploads/' prefix if present
    const cleanKey = key.startsWith('/uploads/') ? key.substring(9) : key;
    await this.s3Service.deleteFile(cleanKey);
  }
}
