export declare class PlacesService {
    private readonly apiKey;
    constructor();
    autocomplete(input: string, language?: string, country?: string): Promise<any>;
    getPlaceDetails(placeId: string, language?: string): Promise<any>;
}
