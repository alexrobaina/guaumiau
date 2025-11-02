import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { PlacesService } from './places.service';

@ApiTags('places')
@Controller('places')
@SkipThrottle()
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get('autocomplete')
  @ApiOperation({ summary: 'Get place autocomplete predictions' })
  @ApiQuery({ name: 'input', description: 'Search query', required: true })
  @ApiQuery({ name: 'language', description: 'Language code', required: false, example: 'es' })
  @ApiQuery({ name: 'country', description: 'Country code', required: false, example: 'ar' })
  @ApiResponse({ status: 200, description: 'Returns place predictions' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async autocomplete(
    @Query('input') input: string,
    @Query('language') language?: string,
    @Query('country') country?: string,
  ) {
    return this.placesService.autocomplete(input, language, country);
  }

  @Get('details')
  @ApiOperation({ summary: 'Get place details by place ID' })
  @ApiQuery({ name: 'placeId', description: 'Google Place ID', required: true })
  @ApiQuery({ name: 'language', description: 'Language code', required: false, example: 'es' })
  @ApiResponse({ status: 200, description: 'Returns place details' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async getPlaceDetails(
    @Query('placeId') placeId: string,
    @Query('language') language?: string,
  ) {
    return this.placesService.getPlaceDetails(placeId, language);
  }
}
