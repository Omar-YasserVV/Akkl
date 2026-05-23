import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

// Used ONLY when clicking "Add New Branch" to start the wizard
export class InitializeBranchDto {
  @ApiProperty({ example: 'rest_123', description: 'Restaurant ID' })
  @IsString()
  @IsNotEmpty()
  restaurantId!: string;

  @ApiProperty({ example: 1, description: 'Unique branch number' })
  @IsInt()
  @IsNotEmpty()
  branchNumber!: number;
}

// Used for Steps 1, 2, 3, and 4
export class UpdateOnboardingDto {
  // ─── Step 1 Fields ───
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Main Branch',
  })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '123 Abbas El Akkad St, Cairo',
  })
  address?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '+201012345678',
  })
  phone?: string;

  // ─── Step 2 Fields ───
  @IsObject()
  @IsOptional()
  @ApiProperty({
    example: {
      monday: { open: '09:00', close: '21:00' },
      tuesday: { open: '09:00', close: '21:00' },
    },
  })
  weeklyHours?: Record<string, any>;

  @IsObject()
  @IsOptional()
  @ApiProperty({
    example: {
      enabled: true,
      threshold: 10,
    },
  })
  busyModeSettings?: Record<string, any>;

  // ─── Step 3 Fields (Floor Plan & Extras) ───
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    example: true,
  })
  haveTables?: boolean;

  @IsArray()
  @IsOptional()
  @ApiProperty({
    example: [
      {
        name: 'Indoor Dining',
        tables: [
          { tableNumber: 'Table 1', capacity: 4 },
          { tableNumber: 'Table 2', capacity: 2 },
        ],
      },
      {
        name: 'Outdoor Patio',
        tables: [
          { tableNumber: 'Patio 1', capacity: 6 },
        ],
      },
    ],
  })
  zones?: Array<{
    name: string;
    tables: Array<{ tableNumber: string; capacity: number }>;
  }>;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    example: false,
  })
  haveReservations?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    example: true,
  })
  haveWarehouses?: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Main Warehouse',
  })
  warehouseName?: string;

  // ─── Step 4 Fields (Hardware) ───
  @IsArray()
  @IsOptional()
  @ApiProperty({
    example: [
      { type: 'KDS', name: 'Kitchen Display 1', ipAddress: '192.168.1.100' },
      {
        type: 'PRINTER',
        name: 'Receipt Printer 1',
        ipAddress: '192.168.1.101',
      },
    ],
  })
  hardware?: Array<{ type: string; name: string; ipAddress: string }>;
}

// Fixed to extend OnboardingDto so standard updates have access to all fields!
export class UpdateBranchDto extends PartialType(UpdateOnboardingDto) {}