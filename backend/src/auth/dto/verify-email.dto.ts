import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
  @ApiProperty({
    description: 'Email verification token',
    example: '1a2b3c4d5e6f7g8h9i0j',
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}
