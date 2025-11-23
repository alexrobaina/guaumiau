import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common'
import { BookingsService } from './bookings.service'
import { CreateBookingDto } from './dto/create-booking.dto'
import { GetTimeSlotsDto } from './dto/get-time-slots.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async createBooking(
    @CurrentUser('id') userId: string,
    @Body() createBookingDto: CreateBookingDto,
  ) {
    return this.bookingsService.createBooking(userId, createBookingDto)
  }

  @Get()
  async getBookings(@CurrentUser('id') userId: string) {
    return this.bookingsService.getBookingsByUser(userId)
  }

  @Get('time-slots')
  async getTimeSlots(@Query() getTimeSlotsDto: GetTimeSlotsDto) {
    return this.bookingsService.getAvailableTimeSlots(
      getTimeSlotsDto.providerId,
      new Date(getTimeSlotsDto.date),
    )
  }

  @Get(':id')
  async getBooking(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.bookingsService.getBooking(id, userId)
  }

  @Patch(':id/cancel')
  async cancelBooking(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.bookingsService.cancelBooking(id, userId)
  }
}
