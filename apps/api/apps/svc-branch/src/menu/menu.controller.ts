import { BranchMenuItemDetailDto, UpdateBranchMenuItemDto } from '@app/common';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MenuService } from './menu.service';

@Controller()
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @MessagePattern('get_all_menus')
  async getAllMenus() {
    return this.menuService.getMenu();
  }

  @MessagePattern('get_branch_menu')
  async getByBranch(@Payload() branchId: number) {
    return this.menuService.getBranchMenu(branchId);
  }

  @MessagePattern('create_menu')
  async create(
    @Payload() payload: { branchId: number; data: BranchMenuItemDetailDto },
  ) {
    return this.menuService.createMenu(payload.branchId, payload.data);
  }

  @MessagePattern('bulk_create_menu')
  async bulkCreate(
    @Payload() payload: { branchId: number; items: BranchMenuItemDetailDto[] },
  ) {
    return this.menuService.bulkCreateMenuItem(payload.branchId, payload.items);
  }

  @MessagePattern('update_menu_item')
  async update(
    @Payload() payload: { menuItemId: number; data: UpdateBranchMenuItemDto },
  ) {
    return this.menuService.updateMenuItem(payload.menuItemId, payload.data);
  }

  @MessagePattern('delete_menu_item')
  async delete(@Payload() menuItemId: number) {
    return this.menuService.deleteMenuItem(menuItemId);
  }
}
