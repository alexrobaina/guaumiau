import { ServiceType } from '@prisma/client';
export declare class CreateBookingDto {
    providerId: string;
    serviceType: ServiceType;
    petIds: string[];
    date: Date;
    time: string;
    location: string;
    instructions?: string;
}
