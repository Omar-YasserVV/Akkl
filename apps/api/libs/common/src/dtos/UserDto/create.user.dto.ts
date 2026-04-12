import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../../../db/generated/client/client';

export class CreateUserDto {
  @ApiProperty({ example: 'omar@email.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: '!password123@zX1' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password!: string;

  @ApiProperty({ example: 'Omar Hassan' })
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @ApiProperty({ example: 'omar_hassan' })
  @IsString()
  @IsNotEmpty()
  username!: string;

  @ApiProperty({ example: '+1234567890' })
  @IsPhoneNumber()
  @IsNotEmpty()
  phone!: string;

  @ApiPropertyOptional({ example: 'https://example.com/profile.jpg' })
  @IsOptional()
  @IsString()
  @IsUrl()
  image?: string;

  @ApiPropertyOptional({ enum: UserRole, default: UserRole.CUSTOMER })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({
    example: 1,
    description: 'The ID of the branch the user belongs to',
  })
  @IsOptional()
  @IsInt()
  branchId?: number;
}
