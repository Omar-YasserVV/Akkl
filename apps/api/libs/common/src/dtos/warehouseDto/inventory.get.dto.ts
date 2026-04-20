// inventory.get.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { BaseInventoryItemDto } from './Inventory.base.dto';

export class GetInventoryItemReqDto {
  @ApiProperty({ example: 'uuid-here' })
  id: string;
}

export class GetInventoryItemResDto extends BaseInventoryItemDto {}
