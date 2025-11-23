import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { ServicesService } from './services.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('services')
@UseGuards(JwtAuthGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  async getServices() {
    return this.servicesService.getAllServices()
  }

  @Get('provider/:providerId')
  async getServicesByProvider(@Param('providerId') providerId: string) {
    return this.servicesService.getServicesByProvider(providerId)
  }
}
