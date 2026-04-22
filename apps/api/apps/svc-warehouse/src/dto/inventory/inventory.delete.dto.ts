// inventory.delete.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class DeleteInventoryItemReqDto {
  @ApiProperty({ example: 'uuid-here' })
  id: string;
}

export class DeleteInventoryItemResDto {
  @ApiProperty({ example: true })
  success: boolean;
}
