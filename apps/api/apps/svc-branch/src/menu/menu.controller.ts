import { BranchMenuItemDetailDto, UpdateBranchMenuItemDto } from '@app/common';
import { BadRequestException, Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MenuService } from './menu.service';

interface KafkaBuffer {
  type: 'Buffer';
  data: number[];
}

@Controller()
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @MessagePattern('get_all_menu_items')
  async getAllItems() {
    return this.menuService.getMenu();
  }

  @MessagePattern('get_branch_menu')
  async getBranchMenu(@Payload('branchId') branchId: number) {
    return this.menuService.getBranchMenu(branchId);
  }

  @MessagePattern('create_menu_item')
  async createMenuItem(
    @Payload('branchId') branchId: number,
    @Payload('data') data: BranchMenuItemDetailDto,
  ) {
    return this.menuService.createMenu(branchId, data);
  }

  @MessagePattern('upload_menu_excel')
  async uploadExcel(
    @Payload('branchId') branchId: number,
    @Payload('fileBuffer') fileBuffer: unknown,
  ) {
    let buffer: Buffer;

    if (Buffer.isBuffer(fileBuffer)) {
      buffer = fileBuffer;
    } else if (
      fileBuffer &&
      typeof fileBuffer === 'object' &&
      'data' in fileBuffer &&
      Array.isArray((fileBuffer as Record<string, unknown>).data)
    ) {
      const kafkaBuffer = fileBuffer as unknown as KafkaBuffer;
      buffer = Buffer.from(kafkaBuffer.data);
    } else {
      throw new BadRequestException('Invalid file buffer received from Kafka');
    }

    return this.menuService.handleExcelUpload(branchId, buffer);
  }

  @MessagePattern('update_menu_item')
  async updateMenuItem(
    @Payload('id') id: number,
    @Payload('branchId') branchId: number,
    @Payload('data') data: UpdateBranchMenuItemDto,
  ) {
    return this.menuService.updateMenuItem(id, data, branchId);
  }

  @MessagePattern('delete_menu_item')
  async deleteMenuItem(
    @Payload('id') id: number,
    @Payload('branchId') branchId: number,
  ) {
    return this.menuService.deleteMenuItem(id, branchId);
  }
}
