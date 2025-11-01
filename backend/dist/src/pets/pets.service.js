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
exports.PetsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PetsService = class PetsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createPetDto) {
        try {
            const pet = await this.prisma.pet.create({
                data: {
                    ...createPetDto,
                    ownerId: userId,
                    photos: createPetDto.photos || [],
                    vaccinationRecords: createPetDto.vaccinationRecords
                        ? createPetDto.vaccinationRecords
                        : [],
                },
            });
            return pet;
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to create pet');
        }
    }
    async findAllByUser(userId) {
        const pets = await this.prisma.pet.findMany({
            where: {
                ownerId: userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return pets;
    }
    async findOne(id, userId) {
        const pet = await this.prisma.pet.findUnique({
            where: { id },
        });
        if (!pet) {
            throw new common_1.NotFoundException(`Pet with ID ${id} not found`);
        }
        if (pet.ownerId !== userId) {
            throw new common_1.ForbiddenException('You do not have access to this pet');
        }
        return pet;
    }
    async update(id, userId, updatePetDto) {
        await this.findOne(id, userId);
        try {
            const dataToUpdate = { ...updatePetDto };
            if (updatePetDto.vaccinationRecords) {
                dataToUpdate.vaccinationRecords = updatePetDto.vaccinationRecords;
            }
            const updatedPet = await this.prisma.pet.update({
                where: { id },
                data: dataToUpdate,
            });
            return updatedPet;
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to update pet');
        }
    }
    async remove(id, userId) {
        await this.findOne(id, userId);
        try {
            await this.prisma.pet.delete({
                where: { id },
            });
            return { message: 'Pet deleted successfully' };
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to delete pet');
        }
    }
    async addPhoto(id, userId, photoUrl) {
        const pet = await this.findOne(id, userId);
        const updatedPet = await this.prisma.pet.update({
            where: { id },
            data: {
                photos: {
                    push: photoUrl,
                },
            },
        });
        return updatedPet;
    }
    async removePhoto(id, userId, photoUrl) {
        const pet = await this.findOne(id, userId);
        const updatedPhotos = pet.photos.filter((photo) => photo !== photoUrl);
        const updatedPet = await this.prisma.pet.update({
            where: { id },
            data: {
                photos: updatedPhotos,
            },
        });
        return updatedPet;
    }
    async updateMedicalInfo(id, userId, medicalInfo) {
        await this.findOne(id, userId);
        const updatedPet = await this.prisma.pet.update({
            where: { id },
            data: medicalInfo,
        });
        return updatedPet;
    }
    async updateBehaviorInfo(id, userId, behaviorInfo) {
        await this.findOne(id, userId);
        const updatedPet = await this.prisma.pet.update({
            where: { id },
            data: behaviorInfo,
        });
        return updatedPet;
    }
    async findMultiple(petIds, userId) {
        const pets = await this.prisma.pet.findMany({
            where: {
                id: { in: petIds },
                ownerId: userId,
            },
        });
        if (pets.length !== petIds.length) {
            throw new common_1.BadRequestException('Some pets not found or not owned by user');
        }
        return pets;
    }
};
exports.PetsService = PetsService;
exports.PetsService = PetsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PetsService);
//# sourceMappingURL=pets.service.js.map