import { StreamableFile } from '@nestjs/common';
import type { Response, Request } from 'express';
import { UploadsService } from './uploads.service';
export declare class UploadsController {
    private readonly uploadsService;
    constructor(uploadsService: UploadsService);
    getFile(folder: string, userId: string, filename: string, res: Response): Promise<StreamableFile>;
    uploadPetImage(request: Request, file: Express.Multer.File): Promise<{
        url: string;
    }>;
    uploadAvatar(request: Request, file: Express.Multer.File): Promise<{
        url: string;
    }>;
}
