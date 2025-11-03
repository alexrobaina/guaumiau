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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PetsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const pets_service_1 = require("./pets.service");
const create_pet_dto_1 = require("./dto/create-pet.dto");
const update_pet_dto_1 = require("./dto/update-pet.dto");
const pet_response_dto_1 = require("./dto/pet-response.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let PetsController = class PetsController {
    petsService;
    constructor(petsService) {
        this.petsService = petsService;
    }
    async create(request, createPetDto) {
        const user = request.user;
        return this.petsService.create(user.id, createPetDto);
    }
    async findAll(request) {
        const user = request.user;
        return this.petsService.findAllByUser(user.id);
    }
    async findOne(request, id) {
        const user = request.user;
        return this.petsService.findOne(id, user.id);
    }
    async update(request, id, updatePetDto) {
        const user = request.user;
        return this.petsService.update(id, user.id, updatePetDto);
    }
    async remove(request, id) {
        const user = request.user;
        return this.petsService.remove(id, user.id);
    }
    async addPhoto(request, id, photoUrl) {
        const user = request.user;
        return this.petsService.addPhoto(id, user.id, photoUrl);
    }
    async removePhoto(request, id, photoUrl) {
        const user = request.user;
        return this.petsService.removePhoto(id, user.id, photoUrl);
    }
    async updateMedicalInfo(request, id, medicalInfo) {
        const user = request.user;
        return this.petsService.updateMedicalInfo(id, user.id, medicalInfo);
    }
    async updateBehaviorInfo(request, id, behaviorInfo) {
        const user = request.user;
        return this.petsService.updateBehaviorInfo(id, user.id, behaviorInfo);
    }
};
exports.PetsController = PetsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new pet' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Pet successfully created',
        type: pet_response_dto_1.PetResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation error' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_pet_dto_1.CreatePetDto]),
    __metadata("design:returntype", Promise)
], PetsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all pets for current user' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of pets',
        type: [pet_response_dto_1.PetResponseDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PetsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific pet by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Pet details',
        type: pet_response_dto_1.PetResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Pet not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - not your pet' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PetsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a pet' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Pet successfully updated',
        type: pet_response_dto_1.PetResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation error' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Pet not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - not your pet' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_pet_dto_1.UpdatePetDto]),
    __metadata("design:returntype", Promise)
], PetsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a pet' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pet successfully deleted' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Pet not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - not your pet' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PetsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/photos'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a photo to a pet' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Photo added successfully',
        type: pet_response_dto_1.PetResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Pet not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - not your pet' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('photoUrl')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], PetsController.prototype, "addPhoto", null);
__decorate([
    (0, common_1.Delete)(':id/photos'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Remove a photo from a pet' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Photo removed successfully',
        type: pet_response_dto_1.PetResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Pet not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - not your pet' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('photoUrl')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], PetsController.prototype, "removePhoto", null);
__decorate([
    (0, common_1.Patch)(':id/medical'),
    (0, swagger_1.ApiOperation)({ summary: 'Update pet medical information' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Medical information updated successfully',
        type: pet_response_dto_1.PetResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Pet not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - not your pet' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], PetsController.prototype, "updateMedicalInfo", null);
__decorate([
    (0, common_1.Patch)(':id/behavior'),
    (0, swagger_1.ApiOperation)({ summary: 'Update pet behavior information' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Behavior information updated successfully',
        type: pet_response_dto_1.PetResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Pet not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - not your pet' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], PetsController.prototype, "updateBehaviorInfo", null);
exports.PetsController = PetsController = __decorate([
    (0, swagger_1.ApiTags)('pets'),
    (0, common_1.Controller)('pets'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [pets_service_1.PetsService])
], PetsController);
//# sourceMappingURL=pets.controller.js.map