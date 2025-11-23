import { ApiProperty } from '@nestjs/swagger'

export class PaymentResponseDto {
  @ApiProperty({ description: 'ID del pago' })
  id: string

  @ApiProperty({ description: 'Estado del pago' })
  status: string

  @ApiProperty({ description: 'Detalle del estado' })
  statusDetail: string

  @ApiProperty({ description: 'Monto total' })
  transactionAmount: number

  @ApiProperty({ description: 'Moneda' })
  currency: string

  @ApiProperty({ description: 'ID de la transacción externa' })
  externalTransactionId: string

  @ApiProperty({ description: 'Comisión de la plataforma' })
  platformCommission: number

  @ApiProperty({ description: 'Monto para el proveedor' })
  providerAmount: number

  @ApiProperty({ description: 'Descripción del pago' })
  description?: string

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: Date
}
