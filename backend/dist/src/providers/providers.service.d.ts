import { PrismaService } from '../prisma/prisma.service';
import { ProviderQueryDto } from './dto/provider-query.dto';
import { ProviderResponseDto, PaginatedProvidersResponseDto } from './dto/provider-response.dto';
export declare class ProvidersService {
    private prisma;
    constructor(prisma: PrismaService);
    private calculateDistance;
    private deg2rad;
    findProviders(query: ProviderQueryDto): Promise<PaginatedProvidersResponseDto>;
    findOne(id: string): Promise<ProviderResponseDto>;
}
