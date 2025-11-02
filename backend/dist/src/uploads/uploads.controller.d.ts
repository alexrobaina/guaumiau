import { UploadsService } from './uploads.service';
export declare class UploadsController {
    private readonly uploadsService;
    constructor(uploadsService: UploadsService);
    uploadPetImage(file: Express.Multer.File, user: any): Promise<{
        url: string;
    }>;
    uploadAvatar(file: Express.Multer.File, user: any): Promise<{
        url: string;
    }>;
}
