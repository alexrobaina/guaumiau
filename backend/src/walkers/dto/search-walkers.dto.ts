import { IsOptional, IsNumber, IsEnum, IsArray, Min, Max } from 'class-validator'
import { Transform, Type } from 'class-transformer'
import { ServiceType } from '@prisma/client'

export class SearchWalkersDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxDistance?: number // in kilometers

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  minRating?: number

  @IsOptional()
  @IsArray()
  @IsEnum(ServiceType, { each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return [value]
    }
    return value
  })
  serviceTypes?: ServiceType[]

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number
}
