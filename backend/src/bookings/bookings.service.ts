import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateBookingDto } from './dto/create-booking.dto'

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name)

  constructor(private readonly prisma: PrismaService) {}

  async createBooking(userId: string, createBookingDto: CreateBookingDto) {
    const { providerId, serviceType, petIds, date, time, location, instructions } = createBookingDto

    this.logger.log(`Creating booking: userId=${userId}, providerId=${providerId}, serviceType=${serviceType}`)

    // Verify provider exists and has this service
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
    })

    this.logger.log(`Provider found: ${!!provider}, Has serviceProvider: ${!!provider?.serviceProvider}`)

    if (!provider || !provider.serviceProvider) {
      this.logger.error(`Service provider not found: providerId=${providerId}`)
      throw new NotFoundException('Service provider not found')
    }

    const service = provider.serviceProvider.services[0]
    if (!service) {
      throw new NotFoundException('Service not found or not available')
    }

    this.logger.log(`Service found: ${service.id}, petIds: ${JSON.stringify(petIds)}`)

    // Validate petIds array
    if (!Array.isArray(petIds) || petIds.length === 0) {
      throw new BadRequestException('At least one pet must be selected')
    }

    // Verify all pets belong to the user
    const pets = await this.prisma.pet.findMany({
      where: {
        id: { in: petIds },
        ownerId: userId,
      },
    })

    this.logger.log(`Pets found: ${pets.length} of ${petIds.length}`)

    if (pets.length !== petIds.length) {
      throw new BadRequestException('One or more pets do not belong to you')
    }

    // Calculate total price based on number of pets with platform commission (15%)
    const numberOfPets = petIds.length
    const serviceTotal = service.basePrice * numberOfPets
    const platformCommissionPercent = 15
    const platformCommission = serviceTotal * (platformCommissionPercent / 100)
    const totalPrice = serviceTotal + platformCommission

    this.logger.log(
      `Price calculation: basePrice=${service.basePrice}, numberOfPets=${numberOfPets}, serviceTotal=${serviceTotal}, commission=${platformCommission}, totalPrice=${totalPrice}`,
    )

    // Parse time string to create startDate
    const [timeStr, meridiem] = time.split(' ')
    const [hours, minutes] = timeStr.split(':').map(Number)
    const startDate = new Date(date)
    startDate.setHours(
      meridiem === 'PM' && hours !== 12 ? hours + 12 : hours === 12 && meridiem === 'AM' ? 0 : hours,
      minutes || 0,
    )

    // Calculate endDate based on service duration
    const endDate = new Date(startDate)
    if (service.duration) {
      endDate.setMinutes(endDate.getMinutes() + service.duration)
    }

    // Create booking
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
        basePrice: serviceTotal, // Total price for all pets (before commission)
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
    })

    return booking
  }

  async getBookingsByUser(userId: string) {
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
    })
  }

  async getBooking(id: string, userId: string) {
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
    })

    if (!booking) {
      throw new NotFoundException('Booking not found')
    }

    if (booking.clientId !== userId && booking.providerId !== userId) {
      throw new ForbiddenException('You do not have access to this booking')
    }

    return booking
  }

  async cancelBooking(id: string, userId: string) {
    const booking = await this.getBooking(id, userId)

    if (booking.status === 'CANCELLED') {
      throw new BadRequestException('Booking is already cancelled')
    }

    if (booking.status === 'COMPLETED') {
      throw new BadRequestException('Cannot cancel a completed booking')
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
    })
  }

  async getAvailableTimeSlots(providerId: string, date: Date): Promise<string[]> {
    // Get all bookings for the provider on the given date
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

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
    })

    // All possible time slots
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
    ]

    // Extract booked times from bookings
    const bookedTimes = bookings.map((b) => {
      const hours = b.startDate.getHours()
      const minutes = b.startDate.getMinutes()
      const meridiem = hours >= 12 ? 'PM' : 'AM'
      const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
      return `${displayHours}:${minutes.toString().padStart(2, '0')} ${meridiem}`
    })

    const availableSlots = allTimeSlots.filter((slot) => !bookedTimes.includes(slot))

    return availableSlots
  }
}
