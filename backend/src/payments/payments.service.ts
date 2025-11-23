import { Injectable, BadRequestException, Logger, NotFoundException } from '@nestjs/common'
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago'
import { PrismaService } from '../prisma/prisma.service'
import { CreatePaymentDto } from './dto/create-payment.dto'
import { PaymentResponseDto } from './dto/payment-response.dto'
import { PAYMENT_CONFIG, CountryCode } from './payments.config'

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name)
  private clients: Map<CountryCode, MercadoPagoConfig> = new Map()
  private paymentClients: Map<CountryCode, Payment> = new Map()
  private preferenceClients: Map<CountryCode, Preference> = new Map()

  constructor(private readonly prisma: PrismaService) {
    this.initializeClients()
  }

  /**
   * Inicializar clientes de Mercado Pago para cada país
   */
  private initializeClients() {
    Object.entries(PAYMENT_CONFIG).forEach(([country, config]) => {
      const countryCode = country as CountryCode

      if (!config.accessToken) {
        this.logger.warn(`No access token configured for country: ${country}`)
        return
      }

      // Cliente de configuración
      const client = new MercadoPagoConfig({
        accessToken: config.accessToken,
        options: {
          timeout: 5000,
        },
      })

      this.clients.set(countryCode, client)
      this.paymentClients.set(countryCode, new Payment(client))
      this.preferenceClients.set(countryCode, new Preference(client))

      this.logger.log(`Mercado Pago client initialized for ${country}`)
    })
  }

  /**
   * Obtener el cliente de pagos según el país
   */
  private getPaymentClient(country: CountryCode): Payment {
    const client = this.paymentClients.get(country)
    if (!client) {
      throw new BadRequestException(`Payment client not configured for country: ${country}`)
    }
    return client
  }

  /**
   * Obtener el cliente de preferencias según el país
   */
  private getPreferenceClient(country: CountryCode): Preference {
    const client = this.preferenceClients.get(country)
    if (!client) {
      throw new BadRequestException(`Preference client not configured for country: ${country}`)
    }
    return client
  }

  /**
   * Crear una preferencia de pago (Checkout Pro)
   * Esto genera un link de pago que se puede abrir en el navegador/webview
   */
  async createPaymentPreference(bookingId: string): Promise<{ preferenceId: string; initPoint: string }> {
    // Obtener la reserva
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        client: true,
        provider: true,
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

    // Determinar el país desde el usuario
    const country = (booking.client.country || 'AR') as CountryCode
    const config = PAYMENT_CONFIG[country]
    const preferenceClient = this.getPreferenceClient(country)

    // Calcular comisión
    const platformCommission = booking.totalPrice * (config.platformCommissionPercent / 100)
    const providerAmount = booking.totalPrice - platformCommission

    this.logger.log(`Creating payment preference for booking ${bookingId}`)
    this.logger.log(`Total: ${booking.totalPrice} ${config.currency}`)
    this.logger.log(`Platform commission: ${platformCommission} ${config.currency}`)
    this.logger.log(`Provider amount: ${providerAmount} ${config.currency}`)

    try {
      // Crear preferencia de pago
      const preference = await preferenceClient.create({
        body: {
          items: [
            {
              id: booking.id,
              title: `Servicio de ${booking.serviceType}`,
              description: `Reserva con ${booking.provider.firstName} ${booking.provider.lastName}`,
              quantity: 1,
              unit_price: booking.totalPrice,
              currency_id: config.currency,
            },
          ],
          payer: {
            email: booking.client.email,
            name: booking.client.firstName,
            surname: booking.client.lastName,
          },
          back_urls: {
            success: `${process.env.FRONTEND_URL}/payment/success`,
            failure: `${process.env.FRONTEND_URL}/payment/failure`,
            pending: `${process.env.FRONTEND_URL}/payment/pending`,
          },
          auto_return: 'approved' as any,
          external_reference: bookingId,
          notification_url: `${process.env.BACKEND_URL}/payments/webhook`,
        },
      })

      this.logger.log(`Payment preference created: ${preference.id}`)

      return {
        preferenceId: preference.id!,
        initPoint: preference.init_point!,
      }
    } catch (error: any) {
      this.logger.error(`Error creating payment preference: ${error.message}`, error.stack)
      throw new BadRequestException(`Failed to create payment preference: ${error.message}`)
    }
  }

  /**
   * Procesar un pago directo (para cuando ya tienes el token de la tarjeta)
   */
  async processPayment(createPaymentDto: CreatePaymentDto): Promise<PaymentResponseDto> {
    const { bookingId, paymentMethodId, token, payerEmail } = createPaymentDto

    // Obtener la reserva
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        client: true,
        provider: true,
      },
    })

    if (!booking) {
      throw new NotFoundException('Booking not found')
    }

    // Determinar el país
    const country = (booking.client.country || 'AR') as CountryCode
    const config = PAYMENT_CONFIG[country]
    const paymentClient = this.getPaymentClient(country)

    // Calcular comisiones
    const platformCommission = booking.totalPrice * (config.platformCommissionPercent / 100)
    const providerAmount = booking.totalPrice - platformCommission

    this.logger.log(`Processing payment for booking ${bookingId}`)
    this.logger.log(`Amount: ${booking.totalPrice} ${config.currency}`)
    this.logger.log(`Platform commission: ${platformCommission}`)

    try {
      // Crear el pago
      const payment = await paymentClient.create({
        body: {
          transaction_amount: booking.totalPrice,
          token,
          description: `Servicio de ${booking.serviceType} - Reserva #${booking.id}`,
          installments: 1,
          payment_method_id: paymentMethodId,
          payer: {
            email: payerEmail,
          },
          external_reference: bookingId,
        },
      })

      this.logger.log(`Payment created: ${payment.id} - Status: ${payment.status}`)

      // Crear registro de transacción en la base de datos
      await this.prisma.transaction.create({
        data: {
          bookingId,
          type: 'PAYMENT',
          amount: booking.totalPrice,
          currency: config.currency,
          serviceFee: providerAmount,
          platformCommission,
          processingFee: 0,
          paymentProvider: 'mercadopago',
          externalTransactionId: payment.id!.toString(),
          status: this.mapPaymentStatus(payment.status!),
          description: createPaymentDto.description || `Pago de reserva ${bookingId}`,
          metadata: {
            paymentMethodId,
            country,
          },
          completedAt: payment.status === 'approved' ? new Date() : undefined,
        },
      })

      // Actualizar el estado del pago en la reserva
      await this.prisma.booking.update({
        where: { id: bookingId },
        data: {
          paymentStatus: this.mapPaymentStatus(payment.status!),
          paymentMethod: this.mapPaymentMethod(paymentMethodId),
          paymentTransactionId: payment.id!.toString(),
          ...(payment.status === 'approved' && { status: 'CONFIRMED', confirmedAt: new Date() }),
        },
      })

      return {
        id: payment.id!.toString(),
        status: payment.status!,
        statusDetail: payment.status_detail!,
        transactionAmount: payment.transaction_amount!,
        currency: config.currency,
        externalTransactionId: payment.id!.toString(),
        platformCommission,
        providerAmount,
        description: payment.description,
        createdAt: new Date(payment.date_created!),
      }
    } catch (error: any) {
      this.logger.error(`Error processing payment: ${error.message}`, error.stack)
      throw new BadRequestException(`Payment failed: ${error.message}`)
    }
  }

  /**
   * Obtener información de un pago
   */
  async getPayment(paymentId: string, country: CountryCode): Promise<any> {
    const paymentClient = this.getPaymentClient(country)

    try {
      const payment = await paymentClient.get({ id: paymentId })
      return payment
    } catch (error: any) {
      this.logger.error(`Error fetching payment: ${error.message}`)
      throw new NotFoundException(`Payment not found: ${paymentId}`)
    }
  }

  /**
   * Procesar webhook de Mercado Pago
   */
  async processWebhook(notification: any): Promise<void> {
    this.logger.log(`Processing webhook: ${JSON.stringify(notification)}`)

    if (notification.type === 'payment') {
      const paymentId = notification.data.id

      // Intentar con ambos países (AR y CO) hasta encontrar el pago
      for (const country of ['AR', 'CO'] as CountryCode[]) {
        try {
          const payment = await this.getPayment(paymentId, country)

          if (payment) {
            await this.updateBookingFromPayment(payment)
            break
          }
        } catch (error) {
          // Continuar con el siguiente país
          continue
        }
      }
    }
  }

  /**
   * Actualizar reserva basándose en el estado del pago
   */
  private async updateBookingFromPayment(payment: any): Promise<void> {
    const bookingId = payment.external_reference

    if (!bookingId) {
      this.logger.warn(`Payment ${payment.id} has no external reference (bookingId)`)
      return
    }

    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    })

    if (!booking) {
      this.logger.warn(`Booking ${bookingId} not found`)
      return
    }

    const newStatus = this.mapPaymentStatus(payment.status)

    this.logger.log(`Updating booking ${bookingId} payment status to ${newStatus}`)

    await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        paymentStatus: newStatus,
        ...(payment.status === 'approved' && { status: 'CONFIRMED', confirmedAt: new Date() }),
        ...(payment.status === 'rejected' && { status: 'CANCELLED', cancelledAt: new Date() }),
      },
    })

    // Actualizar transacción
    await this.prisma.transaction.updateMany({
      where: {
        externalTransactionId: payment.id.toString(),
      },
      data: {
        status: newStatus,
        completedAt: payment.status === 'approved' ? new Date() : undefined,
      },
    })
  }

  /**
   * Mapear estado de Mercado Pago a estado de la DB
   */
  private mapPaymentStatus(mpStatus: string): any {
    const statusMap: Record<string, string> = {
      approved: 'COMPLETED',
      pending: 'PENDING',
      in_process: 'PROCESSING',
      rejected: 'FAILED',
      cancelled: 'FAILED',
      refunded: 'REFUNDED',
    }

    return statusMap[mpStatus] || 'PENDING'
  }

  /**
   * Mapear método de pago de Mercado Pago a enum de la DB
   */
  private mapPaymentMethod(methodId: string): any {
    if (methodId.includes('credit')) return 'CREDIT_CARD'
    if (methodId.includes('debit')) return 'DEBIT_CARD'
    return 'MERCADO_PAGO'
  }

  /**
   * Obtener clave pública de Mercado Pago según país
   */
  getPublicKey(country: CountryCode): string {
    const config = PAYMENT_CONFIG[country]
    if (!config.publicKey) {
      throw new BadRequestException(`Public key not configured for country: ${country}`)
    }
    return config.publicKey
  }
}
