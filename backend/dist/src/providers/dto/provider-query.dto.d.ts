export declare enum ServiceTypeFilter {
    DOG_WALKING = "DOG_WALKING",
    DOG_RUNNING = "DOG_RUNNING",
    DOG_SITTING = "DOG_SITTING",
    CAT_SITTING = "CAT_SITTING",
    PET_SITTING = "PET_SITTING",
    DOG_BOARDING = "DOG_BOARDING",
    CAT_BOARDING = "CAT_BOARDING",
    PET_BOARDING = "PET_BOARDING",
    DOG_DAYCARE = "DOG_DAYCARE",
    PET_DAYCARE = "PET_DAYCARE",
    HOME_VISITS = "HOME_VISITS",
    PET_TAXI = "PET_TAXI"
}
export declare class ProviderQueryDto {
    latitude?: number;
    longitude?: number;
    radius?: number;
    serviceType?: ServiceTypeFilter;
    availableNow?: boolean;
    minRating?: number;
    search?: string;
    page?: number;
    limit?: number;
}
