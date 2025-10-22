import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  HeadBucketCommand,
  CreateBucketCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service implements OnModuleInit {
  private readonly logger = new Logger(S3Service.name);
  private s3Client: S3Client;
  private bucketName: string;
  private isInitialized = false;

  constructor(private configService: ConfigService) {
    const region = this.configService.get<string>('AWS_REGION', 'us-east-1');
    const endpoint = this.configService.get<string>('AWS_S3_ENDPOINT');
    const forcePathStyle = this.configService.get<boolean>('AWS_S3_FORCE_PATH_STYLE', false);

    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME', 'guaumiau-bucket');

    this.s3Client = new S3Client({
      region,
      endpoint,
      forcePathStyle,
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID', 'test'),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY', 'test'),
      },
      requestHandler: {
        requestTimeout: 3000,
      },
    });
  }

  async onModuleInit() {
    await this.ensureBucketExists();
  }

  private async ensureBucketExists() {
    try {
      await this.s3Client.send(new HeadBucketCommand({ Bucket: this.bucketName }));
      this.isInitialized = true;
      this.logger.log(`S3 bucket '${this.bucketName}' is ready`);
    } catch (error) {
      if (error.name === 'NotFound') {
        try {
          await this.s3Client.send(new CreateBucketCommand({ Bucket: this.bucketName }));
          this.isInitialized = true;
          this.logger.log(`S3 bucket '${this.bucketName}' created successfully`);
        } catch (createError) {
          this.logger.error('Failed to create S3 bucket:', createError.message);
          this.logger.warn('S3 storage will be disabled. Make sure LocalStack is running with: npm run docker:up');
        }
      } else if (error.name === 'TimeoutError' || error.code === 'ECONNRESET' || error.code === 'ECONNREFUSED') {
        this.logger.warn('Cannot connect to S3 service. S3 storage will be disabled.');
        this.logger.warn('To enable S3, start LocalStack with: npm run docker:up');
      } else {
        this.logger.error('Error checking S3 bucket:', error.message);
        this.logger.warn('S3 storage will be disabled.');
      }
    }
  }

  async uploadFile(key: string, file: Buffer, contentType?: string): Promise<string> {
    if (!this.isInitialized) {
      throw new Error('S3 service is not initialized. Please start LocalStack with: npm run docker:up');
    }

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file,
      ContentType: contentType,
    });

    await this.s3Client.send(command);
    return key;
  }

  async getFile(key: string): Promise<Buffer> {
    if (!this.isInitialized) {
      throw new Error('S3 service is not initialized. Please start LocalStack with: npm run docker:up');
    }

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const response = await this.s3Client.send(command);
    const chunks: Uint8Array[] = [];

    for await (const chunk of response.Body as any) {
      chunks.push(chunk);
    }

    return Buffer.concat(chunks);
  }

  async deleteFile(key: string): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('S3 service is not initialized. Please start LocalStack with: npm run docker:up');
    }

    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    await this.s3Client.send(command);
  }

  async listFiles(prefix?: string): Promise<string[]> {
    if (!this.isInitialized) {
      throw new Error('S3 service is not initialized. Please start LocalStack with: npm run docker:up');
    }

    const command = new ListObjectsV2Command({
      Bucket: this.bucketName,
      Prefix: prefix,
    });

    const response = await this.s3Client.send(command);
    return response.Contents?.map((item) => item.Key || '') || [];
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    if (!this.isInitialized) {
      throw new Error('S3 service is not initialized. Please start LocalStack with: npm run docker:up');
    }

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn });
  }

  async getPresignedUploadUrl(key: string, expiresIn: number = 3600): Promise<string> {
    if (!this.isInitialized) {
      throw new Error('S3 service is not initialized. Please start LocalStack with: npm run docker:up');
    }

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn });
  }

  isAvailable(): boolean {
    return this.isInitialized;
  }
}
