"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var S3Service_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Service = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
let S3Service = S3Service_1 = class S3Service {
    configService;
    logger = new common_1.Logger(S3Service_1.name);
    s3Client;
    bucketName;
    isInitialized = false;
    constructor(configService) {
        this.configService = configService;
        const region = this.configService.get('AWS_REGION', 'us-east-1');
        const endpoint = this.configService.get('AWS_S3_ENDPOINT');
        const forcePathStyle = this.configService.get('AWS_S3_FORCE_PATH_STYLE', false);
        this.bucketName = this.configService.get('AWS_S3_BUCKET_NAME', 'cruxclimb-bucket');
        this.s3Client = new client_s3_1.S3Client({
            region,
            endpoint,
            forcePathStyle,
            credentials: {
                accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID', 'test'),
                secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY', 'test'),
            },
            requestHandler: {
                requestTimeout: 3000,
            },
        });
    }
    async onModuleInit() {
        await this.ensureBucketExists();
    }
    async ensureBucketExists() {
        try {
            await this.s3Client.send(new client_s3_1.HeadBucketCommand({ Bucket: this.bucketName }));
            this.isInitialized = true;
            this.logger.log(`S3 bucket '${this.bucketName}' is ready`);
        }
        catch (error) {
            if (error.name === 'NotFound') {
                try {
                    await this.s3Client.send(new client_s3_1.CreateBucketCommand({ Bucket: this.bucketName }));
                    this.isInitialized = true;
                    this.logger.log(`S3 bucket '${this.bucketName}' created successfully`);
                }
                catch (createError) {
                    this.logger.error('Failed to create S3 bucket:', createError.message);
                    this.logger.warn('S3 storage will be disabled. Make sure LocalStack is running with: npm run docker:up');
                }
            }
            else if (error.name === 'TimeoutError' || error.code === 'ECONNRESET' || error.code === 'ECONNREFUSED') {
                this.logger.warn('Cannot connect to S3 service. S3 storage will be disabled.');
                this.logger.warn('To enable S3, start LocalStack with: npm run docker:up');
            }
            else {
                this.logger.error('Error checking S3 bucket:', error.message);
                this.logger.warn('S3 storage will be disabled.');
            }
        }
    }
    async uploadFile(key, file, contentType) {
        if (!this.isInitialized) {
            throw new Error('S3 service is not initialized. Please start LocalStack with: npm run docker:up');
        }
        const command = new client_s3_1.PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: file,
            ContentType: contentType,
        });
        await this.s3Client.send(command);
        return key;
    }
    async getFile(key) {
        if (!this.isInitialized) {
            throw new Error('S3 service is not initialized. Please start LocalStack with: npm run docker:up');
        }
        const command = new client_s3_1.GetObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });
        const response = await this.s3Client.send(command);
        const chunks = [];
        for await (const chunk of response.Body) {
            chunks.push(chunk);
        }
        return Buffer.concat(chunks);
    }
    async deleteFile(key) {
        if (!this.isInitialized) {
            throw new Error('S3 service is not initialized. Please start LocalStack with: npm run docker:up');
        }
        const command = new client_s3_1.DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });
        await this.s3Client.send(command);
    }
    async listFiles(prefix) {
        if (!this.isInitialized) {
            throw new Error('S3 service is not initialized. Please start LocalStack with: npm run docker:up');
        }
        const command = new client_s3_1.ListObjectsV2Command({
            Bucket: this.bucketName,
            Prefix: prefix,
        });
        const response = await this.s3Client.send(command);
        return response.Contents?.map((item) => item.Key || '') || [];
    }
    async getSignedUrl(key, expiresIn = 3600) {
        if (!this.isInitialized) {
            throw new Error('S3 service is not initialized. Please start LocalStack with: npm run docker:up');
        }
        const command = new client_s3_1.GetObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });
        return await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, { expiresIn });
    }
    async getPresignedUploadUrl(key, expiresIn = 3600) {
        if (!this.isInitialized) {
            throw new Error('S3 service is not initialized. Please start LocalStack with: npm run docker:up');
        }
        const command = new client_s3_1.PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });
        return await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, { expiresIn });
    }
    isAvailable() {
        return this.isInitialized;
    }
};
exports.S3Service = S3Service;
exports.S3Service = S3Service = S3Service_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], S3Service);
//# sourceMappingURL=s3.service.js.map