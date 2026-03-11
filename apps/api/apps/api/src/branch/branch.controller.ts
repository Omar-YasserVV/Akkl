import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Res,
  HttpStatus,
  UseGuards,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  ClientKafka,
  ClientProxy,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { Response, Request } from 'express';
import { CreateBranchDto, UpdateBranchDto } from '@app/common';
import { lastValueFrom } from 'rxjs';
import { JwtAuthGuard } from '@app/guards/jwt-auth.guard';

// @UseGuards(JwtAuthGuard)
@Controller('branches')
export class BranchController {
  constructor(
    @Inject('BRANCH_SERVICE') private readonly branchClient: ClientKafka,
  ) {}

  async onModuleInit() {
    const topics = ['get-branches', 'get-branch-by-id', 'create-branch'];

    topics.forEach((topic) => {
      this.branchClient.subscribeToResponseOf(topic);
    });

    await this.branchClient.connect();
  }
  @Post(':restaurantId')
  async createBranch(
    @Req() req: any,
    @Body() dto: CreateBranchDto,
    @Param('restaurantId') restaurantId: number,
    @Res() res: Response,
  ) {
    const result = await lastValueFrom(
      this.branchClient.send('create-branch', { restaurantId, dto }),
    );
    console.log('the result', result);
    console.log('the result message', result.message);
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
  async updateBranch(
    @Param('restaurantId') restaurantId: number,
    @Param('branchId') branchId: number,
    @Body() dto: UpdateBranchDto,
  ) {
    return await lastValueFrom(
      this.branchClient.send('update-branch', {
        restaurantId,
        branchId,
        data: dto,
      }),
    );
  }

  @Delete(':restaurantId/:branchId')
  async deleteBranch(
    @Param('restaurantId') restaurantId: number,
    @Param('branchId') branchId: number,
  ) {
    return await lastValueFrom(
      this.branchClient.send('delete-branch', {
        restaurantId,
        branchId,
      }),
    );
  }
}
