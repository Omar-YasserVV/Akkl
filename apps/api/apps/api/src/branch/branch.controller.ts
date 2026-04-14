import {
  BranchMenuItemDetailDto,
  CreateBranchDto,
  CreateOrderDto,
  UpdateBranchDto,
  UpdateBranchMenuItemDto,
  UpdateOrderDto,
} from '@app/common';
import { JwtAuthGuard } from '@app/guards/jwt-auth.guard';
import { RolesGuard } from '@app/guards/role.guard';
import { Roles } from '@app/guards/roles.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  OnModuleInit,
  Param,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { UserRole } from 'libs/db/generated/client/enums';
import { lastValueFrom } from 'rxjs';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.BUSINESS_OWNER)
@Controller('branches')
export class BranchController implements OnModuleInit {
  constructor(
    @Inject('BRANCH_SERVICE') private readonly branchClient: ClientKafka,
  ) {}

  async onModuleInit() {
    const topics = [
      'get-branches',
      'get-branch-by-id',
      'create-branch',
      'update-branch',
      'delete-branch',
      'get_branch_menu',
      'create_menu_item',
      'update_menu_item',
      'delete_menu_item',
      'upload_menu_excel',
      'get_orders_by_branch',
      'get_order_by_id',
      'create_order',
      'update_order',
      'delete_order',
    ];

    topics.forEach((topic) => {
      this.branchClient.subscribeToResponseOf(topic);
    });

    await this.branchClient.connect();
  }

  // --- Branch Endpoints ---

  @Post(':restaurantId')
  async createBranch(
    @Body() dto: CreateBranchDto,
    @Param('restaurantId') restaurantId: number,
    @Res() res: Response,
  ) {
    const result = await lastValueFrom<{ message?: string }>(
      this.branchClient.send('create-branch', { restaurantId, dto }),
    );

    if (result instanceof Error) {
      return res.status(HttpStatus.CONFLICT).json({ message: result.message });
    }
    return res.status(HttpStatus.CREATED).json({ message: 'Branch created' });
  }

  @Get(':restaurantId')
  getBranches(@Param('restaurantId') restaurantId: number) {
    return this.branchClient.send('get-branches', restaurantId);
  }

  @Get(':restaurantId/:branchId')
  getBranchById(
    @Param('restaurantId') restaurantId: number,
    @Param('branchId') branchId: number,
  ) {
    return this.branchClient.send('get-branch-by-id', {
      restaurantId,
      branchId,
    });
  }

  @Patch(':restaurantId/:branchId')
  updateBranch(
    @Param('restaurantId') restaurantId: number,
    @Param('branchId') branchId: number,
    @Body() dto: UpdateBranchDto,
  ) {
    return this.branchClient.send('update-branch', {
      restaurantId,
      branchId,
      data: dto,
    });
  }

  @Delete(':restaurantId/:branchId')
  deleteBranch(
    @Param('restaurantId') restaurantId: number,
    @Param('branchId') branchId: number,
  ) {
    return this.branchClient.send('delete-branch', { restaurantId, branchId });
  }

  // --- Menu Endpoints ---

  @Get(':restaurantId/:branchId/menu')
  getBranchMenu(@Param('branchId') branchId: number) {
    return this.branchClient.send('get_branch_menu', {
      branchId,
    });
  }

  @Post(':restaurantId/:branchId/menu')
  createMenuItem(
    @Param('branchId') branchId: number,
    @Body() data: BranchMenuItemDetailDto,
  ) {
    return this.branchClient.send('create_menu_item', {
      branchId,
      data,
    });
  }

  @Post(':restaurantId/:branchId/menu/upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadMenuExcel(
    @Param('restaurantId') restaurantId: number,
    @Param('branchId') branchId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.branchClient.send('upload_menu_excel', {
      restaurantId,
      branchId,
      fileBuffer: file.buffer,
    });
  }

  @Patch(':restaurantId/:branchId/menu/:menuItemId')
  updateMenuItem(
    @Param('branchId') branchId: number,
    @Param('menuItemId') id: number,
    @Body() data: UpdateBranchMenuItemDto,
  ) {
    return this.branchClient.send('update_menu_item', {
      branchId,
      id,
      data,
    });
  }

  @Delete(':restaurantId/:branchId/menu/:menuItemId')
  deleteMenuItem(
    @Param('branchId') branchId: number,
    @Param('menuItemId') id: number,
  ) {
    return this.branchClient.send('delete_menu_item', {
      id,
      branchId,
    });
  }

  // --- Order Endpoints ---

  @Post(':restaurantId/:branchId/orders')
  createOrder(
    @Param('branchId') branchId: number,
    @Body() data: CreateOrderDto,
  ) {
    return this.branchClient.send('create_order', {
      branchId,
      data,
    });
  }

  @Get(':restaurantId/:branchId/orders')
  getOrdersByBranch(@Param('branchId') branchId: number) {
    return this.branchClient.send('get_orders_by_branch', {
      branchId,
    });
  }

  @Get(':restaurantId/:branchId/orders/:orderId')
  getOrderById(@Param('orderId') orderId: number) {
    return this.branchClient.send('get_order_by_id', {
      orderId,
    });
  }

  @Patch(':restaurantId/:branchId/orders/:orderId')
  updateOrder(@Param('orderId') orderId: number, @Body() data: UpdateOrderDto) {
    return this.branchClient.send('update_order', {
      orderId,
      data,
    });
  }

  @Delete(':restaurantId/:branchId/orders/:orderId')
  deleteOrder(@Param('orderId') orderId: number) {
    return this.branchClient.send('delete_order', {
      orderId,
    });
  }
}
