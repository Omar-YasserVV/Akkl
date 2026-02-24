import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsPhoneNumber,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { UserRole } from '../../../../db/generated/client/client';

export class CompleteGoogleSignupDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  passwordConfirmation: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string;

  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
