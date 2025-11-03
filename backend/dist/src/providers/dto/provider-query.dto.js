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
exports.ProviderQueryDto = exports.ServiceTypeFilter = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
var ServiceTypeFilter;
(function (ServiceTypeFilter) {
    ServiceTypeFilter["DOG_WALKING"] = "DOG_WALKING";
    ServiceTypeFilter["DOG_RUNNING"] = "DOG_RUNNING";
    ServiceTypeFilter["DOG_SITTING"] = "DOG_SITTING";
    ServiceTypeFilter["CAT_SITTING"] = "CAT_SITTING";
    ServiceTypeFilter["PET_SITTING"] = "PET_SITTING";
    ServiceTypeFilter["DOG_BOARDING"] = "DOG_BOARDING";
    ServiceTypeFilter["CAT_BOARDING"] = "CAT_BOARDING";
    ServiceTypeFilter["PET_BOARDING"] = "PET_BOARDING";
    ServiceTypeFilter["DOG_DAYCARE"] = "DOG_DAYCARE";
    ServiceTypeFilter["PET_DAYCARE"] = "PET_DAYCARE";
    ServiceTypeFilter["HOME_VISITS"] = "HOME_VISITS";
    ServiceTypeFilter["PET_TAXI"] = "PET_TAXI";
})(ServiceTypeFilter || (exports.ServiceTypeFilter = ServiceTypeFilter = {}));
class ProviderQueryDto {
    latitude;
    longitude;
    radius = 50;
    serviceType;
    availableNow;
    minRating;
    search;
    page = 1;
    limit = 10;
}
exports.ProviderQueryDto = ProviderQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Latitude for location-based search' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProviderQueryDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Longitude for location-based search' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProviderQueryDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Radius in kilometers',
        default: 50,
        minimum: 1,
        maximum: 500,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(500),
    __metadata("design:type", Number)
], ProviderQueryDto.prototype, "radius", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: ServiceTypeFilter,
        description: 'Filter by service type',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(ServiceTypeFilter),
    __metadata("design:type", String)
], ProviderQueryDto.prototype, "serviceType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by availability (true/false)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], ProviderQueryDto.prototype, "availableNow", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Minimum rating (0-5)',
        minimum: 0,
        maximum: 5,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], ProviderQueryDto.prototype, "minRating", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Search by provider name, city, or bio',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProviderQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Page number for pagination',
        default: 1,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ProviderQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of items per page',
        default: 10,
        minimum: 1,
        maximum: 50,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(50),
    __metadata("design:type", Number)
], ProviderQueryDto.prototype, "limit", void 0);
//# sourceMappingURL=provider-query.dto.js.map