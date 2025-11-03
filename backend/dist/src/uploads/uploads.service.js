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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsService = void 0;
const common_1 = require("@nestjs/common");
const s3_service_1 = require("../s3/s3.service");
const uuid_1 = require("uuid");
let UploadsService = class UploadsService {
    s3Service;
    constructor(s3Service) {
        this.s3Service = s3Service;
    }
    async uploadPetImage(file, userId) {
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Invalid file type. Only JPEG, PNG, and WebP images are allowed');
        }
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new common_1.BadRequestException('File size too large. Maximum size is 5MB');
        }
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `pets/${userId}/${(0, uuid_1.v4)()}.${fileExtension}`;
        await this.s3Service.uploadFile(fileName, file.buffer, file.mimetype);
        const url = `/uploads/${fileName}`;
        return { url };
    }
    async uploadAvatar(file, userId) {
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Invalid file type. Only JPEG, PNG, and WebP images are allowed');
        }
        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new common_1.BadRequestException('File size too large. Maximum size is 2MB');
        }
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `avatars/${userId}/${(0, uuid_1.v4)()}.${fileExtension}`;
        await this.s3Service.uploadFile(fileName, file.buffer, file.mimetype);
        const url = `/uploads/${fileName}`;
        return { url };
    }
    async getFile(key) {
        return await this.s3Service.getFile(key);
    }
    async deleteFile(key) {
        const cleanKey = key.startsWith('/uploads/') ? key.substring(9) : key;
        await this.s3Service.deleteFile(cleanKey);
    }
};
exports.UploadsService = UploadsService;
exports.UploadsService = UploadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [s3_service_1.S3Service])
], UploadsService);
//# sourceMappingURL=uploads.service.js.map