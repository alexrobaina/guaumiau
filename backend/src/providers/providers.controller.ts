import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { ProvidersService } from './providers.service';
import { ProviderQueryDto } from './dto/provider-query.dto';
import {
  ProviderResponseDto,
  PaginatedProvidersResponseDto,
} from './dto/provider-response.dto';

@ApiTags('providers')
@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Get()
  @SkipThrottle() // Skip global throttler for development - remove in production
  @ApiOperation({
    summary: 'Get service providers with filters',
    description:
      'Search for service providers with location-based filtering, service type, rating, and availability filters.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of service providers',
    type: PaginatedProvidersResponseDto,
  })
  async findProviders(
    @Query() query: ProviderQueryDto,
  ): Promise<PaginatedProvidersResponseDto> {
    return this.providersService.findProviders(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a service provider by ID',
    description: 'Retrieve detailed information about a specific service provider',
  })
  @ApiResponse({
    status: 200,
    description: 'Service provider details',
    type: ProviderResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Provider not found',
  })
  async findOne(@Param('id') id: string): Promise<ProviderResponseDto> {
    return this.providersService.findOne(id);
  }
}
