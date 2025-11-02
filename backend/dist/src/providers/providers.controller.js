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
exports.ProvidersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const providers_service_1 = require("./providers.service");
const provider_query_dto_1 = require("./dto/provider-query.dto");
const provider_response_dto_1 = require("./dto/provider-response.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let ProvidersController = class ProvidersController {
    providersService;
    constructor(providersService) {
        this.providersService = providersService;
    }
    async findProviders(query, user) {
        const latitude = query.latitude !== undefined ? query.latitude : (user.latitude ?? undefined);
        const longitude = query.longitude !== undefined ? query.longitude : (user.longitude ?? undefined);
        return this.providersService.findProviders({
            ...query,
            latitude,
            longitude,
        });
    }
    async findOne(id) {
        return this.providersService.findOne(id);
    }
};
exports.ProvidersController = ProvidersController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, throttler_1.Throttle)({ long: { limit: 100, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({
        summary: 'Get service providers with filters',
        description: 'Search for service providers with location-based filtering, service type, rating, and availability filters. If latitude/longitude are not provided in query, uses the authenticated user\'s location.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of service providers',
        type: provider_response_dto_1.PaginatedProvidersResponseDto,
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [provider_query_dto_1.ProviderQueryDto, Object]),
    __metadata("design:returntype", Promise)
], ProvidersController.prototype, "findProviders", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get a service provider by ID',
        description: 'Retrieve detailed information about a specific service provider',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Service provider details',
        type: provider_response_dto_1.ProviderResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Provider not found',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProvidersController.prototype, "findOne", null);
exports.ProvidersController = ProvidersController = __decorate([
    (0, swagger_1.ApiTags)('providers'),
    (0, common_1.Controller)('providers'),
    __metadata("design:paramtypes", [providers_service_1.ProvidersService])
], ProvidersController);
//# sourceMappingURL=providers.controller.js.map