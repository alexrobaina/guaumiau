import { IsString, IsArray, IsDate, IsOptional, IsNotEmpty, IsEnum, ArrayMinSize } from 'class-validator'
import { Type, Transform } from 'class-transformer'
import { ServiceType } from '@prisma/client'

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  providerId: string

  @IsEnum(ServiceType)
  @IsNotEmpty()
  serviceType: ServiceType

  @IsArray()
  @ArrayMinSize(1, { message: 'At least one pet must be selected' })
  @IsString({ each: true })
  @Transform(({ value }) => {
    // Ensure petIds is always an array
    if (typeof value === 'string') {
      return [value]
    }
    if (Array.isArray(value)) {
      return value
    }
    return []
  })
  petIds: string[]

  @IsDate()
  @Type(() => Date)
  date: Date

  @IsString()
  @IsNotEmpty()
  time: string

  @IsString()
  @IsNotEmpty()
  location: string

  @IsString()
  @IsOptional()
  instructions?: string
}
