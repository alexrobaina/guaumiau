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
exports.CreatePetDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
class VaccinationRecordDto {
    name;
    date;
    nextDue;
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Vaccine name', example: 'Rabies' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], VaccinationRecordDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Vaccination date', example: '2024-01-15' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], VaccinationRecordDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Next due date', example: '2025-01-15' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], VaccinationRecordDto.prototype, "nextDue", void 0);
class CreatePetDto {
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
}
exports.CreatePetDto = CreatePetDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Pet name',
        example: 'Max',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePetDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Pet type',
        enum: client_1.PetType,
        example: client_1.PetType.DOG,
    }),
    (0, class_validator_1.IsEnum)(client_1.PetType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePetDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Pet breed',
        example: 'Golden Retriever',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePetDto.prototype, "breed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Pet size',
        enum: client_1.PetSize,
        example: client_1.PetSize.MEDIUM,
    }),
    (0, class_validator_1.IsEnum)(client_1.PetSize),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePetDto.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Pet weight in kg',
        example: 25.5,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePetDto.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Pet age in years',
        example: 3,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(30),
    __metadata("design:type", Number)
], CreatePetDto.prototype, "age", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Pet gender',
        enum: client_1.PetGender,
        example: client_1.PetGender.MALE,
    }),
    (0, class_validator_1.IsEnum)(client_1.PetGender),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePetDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Pet photos URLs',
        example: ['https://example.com/photo1.jpg'],
        type: [String],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreatePetDto.prototype, "photos", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Is pet vaccinated',
        example: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreatePetDto.prototype, "isVaccinated", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Vaccination records',
        type: [VaccinationRecordDto],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => VaccinationRecordDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreatePetDto.prototype, "vaccinationRecords", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Is pet neutered/spayed',
        example: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreatePetDto.prototype, "isNeutered", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Microchip ID',
        example: '123456789',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePetDto.prototype, "microchipId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Pet allergies',
        example: 'Chicken, wheat',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePetDto.prototype, "allergies", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Current medications',
        example: 'Heartgard monthly',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePetDto.prototype, "medications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Special needs or conditions',
        example: 'Arthritis, needs ramp for stairs',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePetDto.prototype, "specialNeeds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Veterinarian name',
        example: 'Dr. Smith',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePetDto.prototype, "vetName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Veterinarian phone',
        example: '+54 11 1234-5678',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePetDto.prototype, "vetPhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Veterinarian address',
        example: 'Av. Santa Fe 1234, Buenos Aires',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePetDto.prototype, "vetAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Energy level',
        enum: client_1.EnergyLevel,
        example: client_1.EnergyLevel.HIGH,
    }),
    (0, class_validator_1.IsEnum)(client_1.EnergyLevel),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePetDto.prototype, "energyLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Friendly with other dogs',
        example: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreatePetDto.prototype, "isFriendlyWithDogs", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Friendly with cats',
        example: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreatePetDto.prototype, "isFriendlyWithCats", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Friendly with kids',
        example: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreatePetDto.prototype, "isFriendlyWithKids", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Training level',
        example: 'Advanced',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePetDto.prototype, "trainingLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Favorite activities',
        example: 'Playing fetch, swimming',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePetDto.prototype, "favoriteActivities", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Preferred walk duration in minutes',
        example: 30,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(5),
    __metadata("design:type", Number)
], CreatePetDto.prototype, "preferredWalkDuration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Preferred walk frequency',
        example: 'Twice daily',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePetDto.prototype, "preferredWalkFrequency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Special instructions for caregivers',
        example: 'Needs to be fed at 8am and 6pm',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePetDto.prototype, "specialInstructions", void 0);
//# sourceMappingURL=create-pet.dto.js.map