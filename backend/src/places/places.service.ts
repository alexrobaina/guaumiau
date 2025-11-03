import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class PlacesService {
  private readonly apiKey: string;

  constructor() {
    // Get API key from environment variable
    this.apiKey = process.env.GOOGLE_PLACES_API_KEY ?? '';
  }

  async autocomplete(input: string, language = 'es', country = 'ar') {
    if (!input || input.length < 2) {
      return { predictions: [] };
    }

    try {
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        input,
      )}&key=${this.apiKey}&language=${language}&components=country:${country}`;

      const response = await fetch(url);
      const data = await response.json();

      if (
        data.status === 'REQUEST_DENIED' ||
        data.status === 'INVALID_REQUEST'
      ) {
        throw new HttpException(
          data.error_message || 'Google Places API error',
          HttpStatus.BAD_REQUEST,
        );
      }

      return data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error fetching place predictions',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPlaceDetails(placeId: string, language = 'es') {
    if (!placeId) {
      throw new HttpException('Place ID is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${this.apiKey}&language=${language}`;

      const response = await fetch(url);
      const data = await response.json();

      if (
        data.status === 'REQUEST_DENIED' ||
        data.status === 'INVALID_REQUEST'
      ) {
        throw new HttpException(
          data.error_message || 'Google Places API error',
          HttpStatus.BAD_REQUEST,
        );
      }

      return data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error fetching place details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
