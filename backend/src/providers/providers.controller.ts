import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ProvidersService } from './providers.service';
import { ProviderQueryDto } from './dto/provider-query.dto';
import {
  ProviderResponseDto,
  PaginatedProvidersResponseDto,
} from './dto/provider-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { User } from '@prisma/client';

@ApiTags('providers')
@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Throttle({ long: { limit: 100, ttl: 60000 } }) // Allow 100 requests per minute for search
  @ApiOperation({
    summary: 'Get service providers with filters',
    description:
      'Search for service providers with location-based filtering, service type, rating, and availability filters. If latitude/longitude are not provided in query, uses the authenticated user\'s location.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of service providers',
    type: PaginatedProvidersResponseDto,
  })
  async findProviders(
    @Query() query: ProviderQueryDto,
    @CurrentUser() user: User,
  ): Promise<PaginatedProvidersResponseDto> {
    // If lat/long not provided in query, use user's location
    const latitude = query.latitude !== undefined ? query.latitude : (user.latitude ?? undefined);
    const longitude = query.longitude !== undefined ? query.longitude : (user.longitude ?? undefined);

    return this.providersService.findProviders({
      ...query,
      latitude,
      longitude,
    });
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
