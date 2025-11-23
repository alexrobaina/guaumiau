import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllServices() {
    return this.prisma.service.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        basePrice: 'asc',
      },
    })
  }

  async getServicesByProvider(providerIdOrUserId: string) {
    // First, try to find services by providerId directly
    let services = await this.prisma.service.findMany({
      where: {
        providerId: providerIdOrUserId,
        isActive: true,
      },
      orderBy: {
        basePrice: 'asc',
      },
    })

    // If no services found, try to find the provider by userId
    if (services.length === 0) {
      const provider = await this.prisma.serviceProviderProfile.findUnique({
        where: { userId: providerIdOrUserId },
      })

      if (provider) {
        services = await this.prisma.service.findMany({
          where: {
            providerId: provider.id,
            isActive: true,
          },
          orderBy: {
            basePrice: 'asc',
          },
        })
      }
    }

    return services
  }
}
