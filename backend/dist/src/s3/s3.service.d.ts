import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class S3Service implements OnModuleInit {
    private configService;
    private readonly logger;
    private s3Client;
    private bucketName;
    private isInitialized;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    private ensureBucketExists;
    uploadFile(key: string, file: Buffer, contentType?: string): Promise<string>;
    getFile(key: string): Promise<Buffer>;
    deleteFile(key: string): Promise<void>;
    listFiles(prefix?: string): Promise<string[]>;
    getSignedUrl(key: string, expiresIn?: number): Promise<string>;
    getPresignedUploadUrl(key: string, expiresIn?: number): Promise<string>;
    isAvailable(): boolean;
}
