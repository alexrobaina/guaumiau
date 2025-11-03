import { ProvidersService } from './providers.service';
import { ProviderQueryDto } from './dto/provider-query.dto';
import { ProviderResponseDto, PaginatedProvidersResponseDto } from './dto/provider-response.dto';
export declare class ProvidersController {
    private readonly providersService;
    constructor(providersService: ProvidersService);
    findProviders(query: ProviderQueryDto): Promise<PaginatedProvidersResponseDto>;
    findOne(id: string): Promise<ProviderResponseDto>;
}
