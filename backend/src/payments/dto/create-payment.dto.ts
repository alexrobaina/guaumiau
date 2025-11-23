import { IsNotEmpty, IsString, IsNumber, IsEnum, IsOptional, IsEmail } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreatePaymentDto {
  @ApiProperty({ description: 'ID de la reserva' })
  @IsNotEmpty()
  @IsString()
  bookingId: string

  @ApiProperty({ description: 'Método de pago', enum: ['credit_card', 'debit_card', 'mercadopago'] })
  @IsNotEmpty()
  @IsString()
  paymentMethodId: string

  @ApiProperty({ description: 'Token del método de pago' })
  @IsOptional()
  @IsString()
  token?: string

  @ApiProperty({ description: 'Email del pagador' })
  @IsNotEmpty()
  @IsEmail()
  payerEmail: string

  @ApiProperty({ description: 'Descripción del pago', required: false })
  @IsOptional()
  @IsString()
  description?: string
}
