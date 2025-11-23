import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator'

export class WebhookNotificationDto {
  @IsNotEmpty()
  @IsString()
  action: string

  @IsNotEmpty()
  @IsString()
  type: string

  @IsOptional()
  data?: {
    id: string
  }

  @IsOptional()
  @IsNumber()
  date_created?: number

  @IsOptional()
  @IsString()
  live_mode?: string

  @IsOptional()
  @IsString()
  user_id?: string
}
