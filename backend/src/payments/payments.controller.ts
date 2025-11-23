import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Logger,
  Req,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { PaymentsService } from './payments.service'
import { CreatePaymentDto } from './dto/create-payment.dto'
import { PaymentResponseDto } from './dto/payment-response.dto'
import { WebhookNotificationDto } from './dto/webhook-notification.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CountryCode } from './payments.config'

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name)

  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('preference')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear preferencia de pago (Checkout Pro)' })
  @ApiResponse({ status: 201, description: 'Preferencia creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Solicitud inválida' })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada' })
  async createPaymentPreference(@Body() body: { bookingId: string }) {
    return this.paymentsService.createPaymentPreference(body.bookingId)
  }

  @Post('process')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Procesar pago directo' })
  @ApiResponse({ status: 201, description: 'Pago procesado exitosamente', type: PaymentResponseDto })
  @ApiResponse({ status: 400, description: 'Pago rechazado' })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada' })
  async processPayment(@Body() createPaymentDto: CreatePaymentDto): Promise<PaymentResponseDto> {
    return this.paymentsService.processPayment(createPaymentDto)
  }

  @Get('public-key/:country')
  @ApiOperation({ summary: 'Obtener clave pública de Mercado Pago' })
  @ApiResponse({ status: 200, description: 'Clave pública obtenida' })
  @ApiResponse({ status: 400, description: 'País no configurado' })
  async getPublicKey(@Param('country') country: string) {
    const publicKey = this.paymentsService.getPublicKey(country.toUpperCase() as CountryCode)
    return { publicKey, country }
  }

  @Get(':paymentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener información de un pago' })
  @ApiResponse({ status: 200, description: 'Información del pago' })
  @ApiResponse({ status: 404, description: 'Pago no encontrado' })
  async getPayment(
    @Param('paymentId') paymentId: string,
    @Query('country') country: string = 'AR',
  ) {
    return this.paymentsService.getPayment(paymentId, country.toUpperCase() as CountryCode)
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook de Mercado Pago' })
  @ApiResponse({ status: 200, description: 'Notificación procesada' })
  async handleWebhook(@Body() notification: WebhookNotificationDto, @Req() request: any) {
    this.logger.log(`Received webhook notification: ${JSON.stringify(notification)}`)

    try {
      await this.paymentsService.processWebhook(notification)
      return { status: 'ok' }
    } catch (error: any) {
      this.logger.error(`Error processing webhook: ${error.message}`, error.stack)
      // Retornar 200 de todos modos para evitar reintentos de MP
      return { status: 'error', message: error.message }
    }
  }
}
