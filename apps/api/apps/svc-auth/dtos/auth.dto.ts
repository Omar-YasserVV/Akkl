import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class LogoutDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access or refresh token to invalidate',
  })
  @IsString()
  @IsNotEmpty()
  token!: string;
}

export class GoogleUserDto {
  @ApiProperty({
    example: 'john.doe@gmail.com',
    description: 'Google account email',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name from Google account',
  })
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @ApiPropertyOptional({
    example: 'https://example.com/profile.jpg',
    description: 'Optional profile image URL',
  })
  @IsOptional()
  @IsString()
  image?: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    example: 'john.doe@gmail.com',
    description: 'Email of the account to reset',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: '123456',
    description: 'OTP received via email or SMS',
  })
  @IsString()
  @IsNotEmpty()
  otp!: string;

  @ApiProperty({
    example: 'NewPassword123!',
    description: 'New password (minimum 8 characters)',
  })
  @IsString()
  @MinLength(8)
  newPassword!: string;
}
