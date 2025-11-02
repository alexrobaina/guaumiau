import { S3Service } from '../s3/s3.service';
export declare class UploadsService {
    private s3Service;
    constructor(s3Service: S3Service);
    uploadPetImage(file: Express.Multer.File, userId: string): Promise<{
        url: string;
    }>;
    uploadAvatar(file: Express.Multer.File, userId: string): Promise<{
        url: string;
    }>;
    deleteFile(key: string): Promise<void>;
}
