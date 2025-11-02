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
exports.PlacesService = void 0;
const common_1 = require("@nestjs/common");
let PlacesService = class PlacesService {
    apiKey;
    constructor() {
        this.apiKey = process.env.GOOGLE_PLACES_API_KEY || 'AIzaSyCqFbjokkkUeyPBp2Q8521jviFfzoJmnnE';
    }
    async autocomplete(input, language = 'es', country = 'ar') {
        if (!input || input.length < 2) {
            return { predictions: [] };
        }
        try {
            const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${this.apiKey}&language=${language}&components=country:${country}`;
            const response = await fetch(url);
            const data = await response.json();
            if (data.status === 'REQUEST_DENIED' || data.status === 'INVALID_REQUEST') {
                throw new common_1.HttpException(data.error_message || 'Google Places API error', common_1.HttpStatus.BAD_REQUEST);
            }
            return data;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Error fetching place predictions', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getPlaceDetails(placeId, language = 'es') {
        if (!placeId) {
            throw new common_1.HttpException('Place ID is required', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${this.apiKey}&language=${language}`;
            const response = await fetch(url);
            const data = await response.json();
            if (data.status === 'REQUEST_DENIED' || data.status === 'INVALID_REQUEST') {
                throw new common_1.HttpException(data.error_message || 'Google Places API error', common_1.HttpStatus.BAD_REQUEST);
            }
            return data;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Error fetching place details', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.PlacesService = PlacesService;
exports.PlacesService = PlacesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PlacesService);
//# sourceMappingURL=places.service.js.map