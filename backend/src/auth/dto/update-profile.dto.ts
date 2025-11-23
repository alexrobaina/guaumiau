import { IsEmail, IsString, IsOptional, MinLength, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Unique username',
    example: 'johndoe',
    minLength: 3,
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  username?: string;

  @ApiPropertyOptional({
    description: 'User first name',
    example: 'John',
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({
    description: 'User last name',
    example: 'Doe',
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '+5491123456789',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    description: 'User avatar URL',
    example: 'https://example.com/avatar.jpg',
  })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiPropertyOptional({
    description: 'User address',
    example: 'Av. Corrientes 1234, Buenos Aires, Argentina',
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({
    description: 'Address latitude coordinate',
    example: -34.6037,
  })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional({
    description: 'Address longitude coordinate',
    example: -58.3816,
  })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiPropertyOptional({
    description: 'City extracted from address',
    example: 'Buenos Aires',
  })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({
    description: 'State/Province',
    example: 'Buenos Aires',
  })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional({
    description: 'Postal Code',
    example: '1043',
  })
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiPropertyOptional({
    description: 'Country extracted from address',
    example: 'Argentina',
  })
  @IsString()
  @IsOptional()
  country?: string;
}
