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
exports.PlacesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const places_service_1 = require("./places.service");
let PlacesController = class PlacesController {
    placesService;
    constructor(placesService) {
        this.placesService = placesService;
    }
    async autocomplete(input, language, country) {
        return this.placesService.autocomplete(input, language, country);
    }
    async getPlaceDetails(placeId, language) {
        return this.placesService.getPlaceDetails(placeId, language);
    }
};
exports.PlacesController = PlacesController;
__decorate([
    (0, common_1.Get)('autocomplete'),
    (0, swagger_1.ApiOperation)({ summary: 'Get place autocomplete predictions' }),
    (0, swagger_1.ApiQuery)({ name: 'input', description: 'Search query', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'language', description: 'Language code', required: false, example: 'es' }),
    (0, swagger_1.ApiQuery)({ name: 'country', description: 'Country code', required: false, example: 'ar' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns place predictions' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    __param(0, (0, common_1.Query)('input')),
    __param(1, (0, common_1.Query)('language')),
    __param(2, (0, common_1.Query)('country')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], PlacesController.prototype, "autocomplete", null);
__decorate([
    (0, common_1.Get)('details'),
    (0, swagger_1.ApiOperation)({ summary: 'Get place details by place ID' }),
    (0, swagger_1.ApiQuery)({ name: 'placeId', description: 'Google Place ID', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'language', description: 'Language code', required: false, example: 'es' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns place details' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    __param(0, (0, common_1.Query)('placeId')),
    __param(1, (0, common_1.Query)('language')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PlacesController.prototype, "getPlaceDetails", null);
exports.PlacesController = PlacesController = __decorate([
    (0, swagger_1.ApiTags)('places'),
    (0, common_1.Controller)('places'),
    (0, throttler_1.SkipThrottle)(),
    __metadata("design:paramtypes", [places_service_1.PlacesService])
], PlacesController);
//# sourceMappingURL=places.controller.js.map