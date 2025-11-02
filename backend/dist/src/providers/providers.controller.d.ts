import { ProvidersService } from './providers.service';
import { ProviderQueryDto } from './dto/provider-query.dto';
import { ProviderResponseDto, PaginatedProvidersResponseDto } from './dto/provider-response.dto';
import type { User } from '@prisma/client';
export declare class ProvidersController {
    private readonly providersService;
    constructor(providersService: ProvidersService);
    findProviders(query: ProviderQueryDto, user: User): Promise<PaginatedProvidersResponseDto>;
    findOne(id: string): Promise<ProviderResponseDto>;
}
