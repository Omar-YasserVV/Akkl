import { ApiProperty } from '@nestjs/swagger';

export class GetWarehouseByBranchReqDto {
  @ApiProperty({ example: 'uuid-here' })
  branchId: string;
}

export class GetWarehouseByBranchResDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  branchId: string;
}
