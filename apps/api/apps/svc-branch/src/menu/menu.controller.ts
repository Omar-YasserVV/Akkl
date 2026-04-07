import { BranchMenuItemDetailDto, UpdateBranchMenuItemDto } from '@app/common';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MenuService } from './menu.service';

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
    @Payload('fileBuffer') fileBuffer: Buffer, // Expecting the buffer to be passed in the payload
  ) {
    // Note: Validation logic usually moves to the calling gateway or a dedicated validation pipe
    return this.menuService.handleExcelUpload(branchId, fileBuffer);
  }

  @MessagePattern('update_menu_item')
  async updateMenuItem(
    @Payload('id') id: number,
    @Payload('data') data: UpdateBranchMenuItemDto,
  ) {
    return this.menuService.updateMenuItem(id, data);
  }

  @MessagePattern('delete_menu_item')
  async deleteMenuItem(@Payload('id') id: number) {
    return this.menuService.deleteMenuItem(id);
  }
}
