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
exports.PetResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class PetResponseDto {
    id;
    ownerId;
    name;
    type;
    breed;
    size;
    weight;
    age;
    gender;
    photos;
    isVaccinated;
    vaccinationRecords;
    isNeutered;
    microchipId;
    allergies;
    medications;
    specialNeeds;
    vetName;
    vetPhone;
    vetAddress;
    energyLevel;
    isFriendlyWithDogs;
    isFriendlyWithCats;
    isFriendlyWithKids;
    trainingLevel;
    favoriteActivities;
    preferredWalkDuration;
    preferredWalkFrequency;
    specialInstructions;
    createdAt;
    updatedAt;
}
exports.PetResponseDto = PetResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-123' }),
    __metadata("design:type", String)
], PetResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-user-123' }),
    __metadata("design:type", String)
], PetResponseDto.prototype, "ownerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Max' }),
    __metadata("design:type", String)
], PetResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.PetType, example: client_1.PetType.DOG }),
    __metadata("design:type", String)
], PetResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Golden Retriever' }),
    __metadata("design:type", Object)
], PetResponseDto.prototype, "breed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.PetSize, example: client_1.PetSize.MEDIUM }),
    __metadata("design:type", String)
], PetResponseDto.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 25.5 }),
    __metadata("design:type", Object)
], PetResponseDto.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 3 }),
    __metadata("design:type", Object)
], PetResponseDto.prototype, "age", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.PetGender, example: client_1.PetGender.MALE }),
    __metadata("design:type", String)
], PetResponseDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String] }),
    __metadata("design:type", Array)
], PetResponseDto.prototype, "photos", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    __metadata("design:type", Boolean)
], PetResponseDto.prototype, "isVaccinated", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], PetResponseDto.prototype, "vaccinationRecords", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    __metadata("design:type", Boolean)
], PetResponseDto.prototype, "isNeutered", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '123456789' }),
    __metadata("design:type", Object)
], PetResponseDto.prototype, "microchipId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Chicken, wheat' }),
    __metadata("design:type", Object)
], PetResponseDto.prototype, "allergies", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Heartgard monthly' }),
    __metadata("design:type", Object)
], PetResponseDto.prototype, "medications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Arthritis, needs ramp for stairs' }),
    __metadata("design:type", Object)
], PetResponseDto.prototype, "specialNeeds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Dr. Smith' }),
    __metadata("design:type", Object)
], PetResponseDto.prototype, "vetName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '+54 11 1234-5678' }),
    __metadata("design:type", Object)
], PetResponseDto.prototype, "vetPhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Av. Santa Fe 1234, Buenos Aires' }),
    __metadata("design:type", Object)
], PetResponseDto.prototype, "vetAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.EnergyLevel, example: client_1.EnergyLevel.HIGH }),
    __metadata("design:type", Object)
], PetResponseDto.prototype, "energyLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    __metadata("design:type", Boolean)
], PetResponseDto.prototype, "isFriendlyWithDogs", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    __metadata("design:type", Boolean)
], PetResponseDto.prototype, "isFriendlyWithCats", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    __metadata("design:type", Boolean)
], PetResponseDto.prototype, "isFriendlyWithKids", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Advanced' }),
    __metadata("design:type", Object)
], PetResponseDto.prototype, "trainingLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Playing fetch, swimming' }),
    __metadata("design:type", Object)
], PetResponseDto.prototype, "favoriteActivities", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 30 }),
    __metadata("design:type", Object)
], PetResponseDto.prototype, "preferredWalkDuration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Twice daily' }),
    __metadata("design:type", Object)
], PetResponseDto.prototype, "preferredWalkFrequency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Needs to be fed at 8am and 6pm' }),
    __metadata("design:type", Object)
], PetResponseDto.prototype, "specialInstructions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], PetResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], PetResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=pet-response.dto.js.map