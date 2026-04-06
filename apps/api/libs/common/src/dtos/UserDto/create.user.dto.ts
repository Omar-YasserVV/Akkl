import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../../../db/generated/client/client';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'omar@email.com' })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @ApiProperty({ example: '!password123@zX1' })
  password!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Omar Hassan' })
  fullName!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'omar_hassan' })
  username!: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  @ApiProperty({ example: '+1234567890' })
  phone!: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'https://example.com/profile.jpg' })
  image?: string;

  @IsOptional()
  @IsEnum(UserRole)
  @ApiProperty({ enum: UserRole })
  role?: UserRole;
}
