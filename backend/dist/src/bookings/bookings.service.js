"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var BookingsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BookingsService = BookingsService_1 = class BookingsService {
    prisma;
    logger = new common_1.Logger(BookingsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createBooking(userId, createBookingDto) {
        const { providerId, serviceType, petIds, date, time, location, instructions } = createBookingDto;
        this.logger.log(`Creating booking: userId=${userId}, providerId=${providerId}, serviceType=${serviceType}`);
        const provider = await this.prisma.user.findFirst({
            where: {
                id: providerId,
                roles: { has: 'SERVICE_PROVIDER' },
            },
            include: {
                serviceProvider: {
                    include: {
                        services: {
                            where: {
                                serviceType,
                                isActive: true,
                            },
                        },
                    },
                },
            },
        });
        this.logger.log(`Provider found: ${!!provider}, Has serviceProvider: ${!!provider?.serviceProvider}`);
        if (!provider || !provider.serviceProvider) {
            this.logger.error(`Service provider not found: providerId=${providerId}`);
            throw new common_1.NotFoundException('Service provider not found');
        }
        const service = provider.serviceProvider.services[0];
        if (!service) {
            throw new common_1.NotFoundException('Service not found or not available');
        }
        this.logger.log(`Service found: ${service.id}, petIds: ${JSON.stringify(petIds)}`);
        if (!Array.isArray(petIds) || petIds.length === 0) {
            throw new common_1.BadRequestException('At least one pet must be selected');
        }
        const pets = await this.prisma.pet.findMany({
            where: {
                id: { in: petIds },
                ownerId: userId,
            },
        });
        this.logger.log(`Pets found: ${pets.length} of ${petIds.length}`);
        if (pets.length !== petIds.length) {
            throw new common_1.BadRequestException('One or more pets do not belong to you');
        }
        const numberOfPets = petIds.length;
        const serviceTotal = service.basePrice * numberOfPets;
        const platformCommissionPercent = 15;
        const platformCommission = serviceTotal * (platformCommissionPercent / 100);
        const totalPrice = serviceTotal + platformCommission;
        this.logger.log(`Price calculation: basePrice=${service.basePrice}, numberOfPets=${numberOfPets}, serviceTotal=${serviceTotal}, commission=${platformCommission}, totalPrice=${totalPrice}`);
        const [timeStr, meridiem] = time.split(' ');
        const [hours, minutes] = timeStr.split(':').map(Number);
        const startDate = new Date(date);
        startDate.setHours(meridiem === 'PM' && hours !== 12 ? hours + 12 : hours === 12 && meridiem === 'AM' ? 0 : hours, minutes || 0);
        const endDate = new Date(startDate);
        if (service.duration) {
            endDate.setMinutes(endDate.getMinutes() + service.duration);
        }
        const booking = await this.prisma.booking.create({
            data: {
                clientId: userId,
                providerId,
                serviceType,
                status: 'PENDING',
                startDate,
                endDate,
                duration: service.duration,
                pickupAddress: location,
                basePrice: serviceTotal,
                platformCommission,
                totalPrice,
                specialInstructions: instructions,
                pets: {
                    create: petIds.map((petId) => ({
                        petId,
                    })),
                },
            },
            include: {
                client: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        avatar: true,
                    },
                },
                provider: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        avatar: true,
                    },
                },
                pets: {
                    include: {
                        pet: true,
                    },
                },
            },
        });
        return booking;
    }
    async getBookingsByUser(userId) {
        return this.prisma.booking.findMany({
            where: {
                OR: [{ clientId: userId }, { providerId: userId }],
            },
            include: {
                client: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        avatar: true,
                    },
                },
                provider: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        avatar: true,
                    },
                },
                pets: {
                    include: {
                        pet: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async getBooking(id, userId) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
            include: {
                client: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        avatar: true,
                    },
                },
                provider: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        avatar: true,
                    },
                },
                pets: {
                    include: {
                        pet: true,
                    },
                },
            },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.clientId !== userId && booking.providerId !== userId) {
            throw new common_1.ForbiddenException('You do not have access to this booking');
        }
        return booking;
    }
    async cancelBooking(id, userId) {
        const booking = await this.getBooking(id, userId);
        if (booking.status === 'CANCELLED') {
            throw new common_1.BadRequestException('Booking is already cancelled');
        }
        if (booking.status === 'COMPLETED') {
            throw new common_1.BadRequestException('Cannot cancel a completed booking');
        }
        return this.prisma.booking.update({
            where: { id },
            data: {
                status: 'CANCELLED',
                cancelledAt: new Date(),
                cancelledBy: userId,
            },
            include: {
                client: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        avatar: true,
                    },
                },
                provider: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        avatar: true,
                    },
                },
                pets: {
                    include: {
                        pet: true,
                    },
                },
            },
        });
    }
    async getAvailableTimeSlots(providerId, date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        const bookings = await this.prisma.booking.findMany({
            where: {
                providerId,
                startDate: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
                status: {
                    in: ['PENDING', 'CONFIRMED'],
                },
            },
        });
        const allTimeSlots = [
            '8:00 AM',
            '9:00 AM',
            '10:00 AM',
            '11:00 AM',
            '12:00 PM',
            '1:00 PM',
            '2:00 PM',
            '3:00 PM',
            '4:00 PM',
            '5:00 PM',
            '6:00 PM',
            '7:00 PM',
        ];
        const bookedTimes = bookings.map((b) => {
            const hours = b.startDate.getHours();
            const minutes = b.startDate.getMinutes();
            const meridiem = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
            return `${displayHours}:${minutes.toString().padStart(2, '0')} ${meridiem}`;
        });
        const availableSlots = allTimeSlots.filter((slot) => !bookedTimes.includes(slot));
        return availableSlots;
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = BookingsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map