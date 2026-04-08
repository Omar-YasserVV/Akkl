import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../../../db/generated/client/client';

export class CompleteGoogleSignupDto {
  @ApiProperty({
    example: 'ya29.a0ARrdaM-abcdef1234567890',
    description: 'Google OAuth token received from client',
  })
  @IsString()
  @IsNotEmpty()
  token!: string;

  @ApiProperty({
    example: 'SuperSecret123!',
    description: 'Password (minimum 8 characters)',
  })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({
    example: 'SuperSecret123!',
    description: 'Password confirmation, must match password',
  })
  @IsString()
  @IsNotEmpty()
  passwordConfirmation!: string;

  @ApiProperty({
    example: '+201234567890',
    description: 'User phone number in E.164 format',
  })
  @IsPhoneNumber()
  @IsNotEmpty()
  phone!: string;

  @ApiPropertyOptional({
    example: 'john_doe',
    description: 'Optional username',
  })
  @IsOptional()
  @IsString()
  username!: string;

  @ApiPropertyOptional({
    enum: UserRole,
    example: UserRole.BUSINESS_OWNER || UserRole.CUSTOMER,
    description: 'Optional user role (default: USER)',
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
