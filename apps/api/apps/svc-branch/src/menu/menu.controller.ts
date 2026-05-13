import { BranchMenuItemDetailDto, UpdateBranchMenuItemDto } from '@app/common';
import { BRANCH_TOPICS } from '@app/common/topics/branch.topics';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { MenuService } from './menu.service';

interface KafkaBuffer {
  type: 'Buffer';
  data: number[];
}

@Controller()
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @MessagePattern(BRANCH_TOPICS.GET_ALL_MENU_ITEMS)
  async getAllItems(@Payload('branchId') branchId: string) {
    return this.menuService.getMenu(branchId);
  }

  @MessagePattern(BRANCH_TOPICS.GET_MENU_SUMMARY)
  async getMenuSummary(@Payload('branchId') branchId: string) {
    return this.menuService.getMenuSummary(branchId);
  }

  @MessagePattern(BRANCH_TOPICS.GET_MENU)
  async getBranchMenu(
    @Payload('branchId') branchId: string,
    @Payload('pagination')
    pagination: {
      page?: number;
      limit?: number;
      category?: any;
      isAvailable?: boolean;
    },
  ) {
    return this.menuService.getBranchMenu(branchId, pagination);
  }

  @MessagePattern(BRANCH_TOPICS.CREATE_MENU)
  async createMenuItem(
    @Payload('branchId') branchId: string,
    @Payload('data') data: BranchMenuItemDetailDto,
  ) {
    return this.menuService.createMenu(branchId, data);
  }

  @MessagePattern(BRANCH_TOPICS.UPLOAD_MENU)
  async uploadExcel(
    @Payload('branchId') branchId: string,
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
      throw new RpcException({
        message: 'Invalid file buffer received from Kafka',
        statusCode: 400,
      });
    }

    return this.menuService.handleExcelUpload(branchId, buffer);
  }

  @MessagePattern(BRANCH_TOPICS.UPDATE_MENU)
  async updateMenuItem(
    @Payload('id') id: string,
    @Payload('branchId') branchId: string,
    @Payload('data') data: UpdateBranchMenuItemDto,
  ) {
    return this.menuService.updateMenuItem(id, data, branchId);
  }

  @MessagePattern(BRANCH_TOPICS.DELETE_MENU)
  async deleteMenuItem(
    @Payload('id') id: string,
    @Payload('branchId') branchId: string,
  ) {
    return this.menuService.deleteMenuItem(id, branchId);
  }
}
