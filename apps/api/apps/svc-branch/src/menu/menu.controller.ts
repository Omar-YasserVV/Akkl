import { BranchMenuItemDetailDto, UpdateBranchMenuItemDto } from '@app/common';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MenuService } from './menu.service';

interface UploadedExcelFile {
  buffer: Buffer;
}

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  async getAllItems() {
    return this.menuService.getMenu();
  }

  @Get('branch/:branchId')
  async getBranchMenu(@Param('branchId', ParseIntPipe) branchId: number) {
    return this.menuService.getBranchMenu(branchId);
  }

  @Post('branch/:branchId')
  async createMenuItem(
    @Param('branchId', ParseIntPipe) branchId: number,
    @Body() createDto: BranchMenuItemDetailDto,
  ) {
    return this.menuService.createMenu(branchId, createDto);
  }

  @Post('branch/:branchId/upload-excel')
  @UseInterceptors(FileInterceptor('file'))
  async uploadExcel(
    @Param('branchId', ParseIntPipe) branchId: number,
    @UploadedFile() file: UploadedExcelFile,
  ) {
    if (!file || !file.buffer) {
      throw new BadRequestException('No file uploaded');
    }
    return this.menuService.handleExcelUpload(branchId, file.buffer);
  }

  @Put(':id')
  async updateMenuItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateBranchMenuItemDto,
  ) {
    return this.menuService.updateMenuItem(id, updateDto);
  }

  @Delete(':id')
  async deleteMenuItem(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.deleteMenuItem(id);
  }
}
