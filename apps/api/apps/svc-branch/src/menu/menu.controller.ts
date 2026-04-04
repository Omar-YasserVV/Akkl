import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MenuService } from './menu.service';
import { BranchMenuItemDetailDto, UpdateBranchMenuItemDto } from '@app/common';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @MessagePattern('get_all_menus')
  async getAllMenus() {
    return this.menuService.getMenu();
  }

  @MessagePattern('get_branch_menu')
  async getByBranch(@Param('branchId', ParseIntPipe) branchId: number) {
    return this.menuService.getBranchMenu(branchId);
  }

  @MessagePattern('create_menu')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('branchId', ParseIntPipe) branchId: number,
    @Body() createMenuDto: BranchMenuItemDetailDto,
  ) {
    return this.menuService.createMenu(branchId, createMenuDto);
  }

  @MessagePattern('update_menu_item')
  async update(
    @Param('menuItemId', ParseIntPipe) menuItemId: number,
    @Body() updateMenuItemDto: UpdateBranchMenuItemDto,
  ) {
    return this.menuService.updateMenuItem(menuItemId, updateMenuItemDto);
  }

  @MessagePattern('delete_menu_item')
  async delete(@Param('menuItemId', ParseIntPipe) menuItemId: number) {
    return this.menuService.deleteMenuItem(menuItemId);
  }
}
