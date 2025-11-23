import { IsString, IsNotEmpty, IsDateString } from 'class-validator'

export class GetTimeSlotsDto {
  @IsString()
  @IsNotEmpty()
  providerId: string

  @IsDateString()
  @IsNotEmpty()
  date: string
}
