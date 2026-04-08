import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { StaffRole } from 'libs/db/generated/client/enums'; // Adjust path based on your Prisma generated types

export class CreateEmployeeDto {
  @ApiProperty({
    description: 'The full legal name of the employee',
    example: 'Omar Yasser',
  })
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @ApiProperty({
    description: 'The unique username for desktop app login',
    example: 'omar_admin_01',
  })
  @IsString()
  @IsNotEmpty()
  username!: string;

  @ApiProperty({
    description: 'The unique email address of the staff member',
    example: 'omar.staff@example.com',
  })
  @IsString()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    description: 'Password for the staff account (min 6 characters)',
    example: 'strongPassword123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({
    description: 'The operational role assigned to the employee',
    enum: StaffRole,
    example: StaffRole.ADMIN,
  })
  @IsEnum(StaffRole)
  role!: StaffRole;

  @ApiProperty({
    description: 'Profile image URL for the employee',
    required: false,
    example: 'https://example.com/photo.jpg',
  })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({
    description: 'The ID of the branch this employee is assigned to',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  branchId!: number;
}

export class EmployeeLoginDto {
  @ApiProperty({
    description: 'The unique email of the staff member',
    example: 'omar.staff@example.com',
  })
  @IsString()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    description: 'Staff account password',
    example: 'strongPassword123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password!: string;
}
