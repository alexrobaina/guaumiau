import { PlacesService } from './places.service';
export declare class PlacesController {
    private readonly placesService;
    constructor(placesService: PlacesService);
    autocomplete(input: string, language?: string, country?: string): Promise<any>;
    getPlaceDetails(placeId: string, language?: string): Promise<any>;
}
