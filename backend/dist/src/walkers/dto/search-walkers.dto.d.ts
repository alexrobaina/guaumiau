import { ServiceType } from '@prisma/client';
export declare class SearchWalkersDto {
    latitude?: number;
    longitude?: number;
    maxDistance?: number;
    minRating?: number;
    serviceTypes?: ServiceType[];
    maxPrice?: number;
    minPrice?: number;
}
