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
import { ClientKafka, ClientProxy } from '@nestjs/microservices';
import { Response, Request } from 'express';
import { CreateBranchDto, UpdateBranchDto } from '@app/common';
import { lastValueFrom } from 'rxjs';
import { JwtAuthGuard } from '@app/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('branches')
export class BranchController {
  constructor(
    @Inject('BRANCH_SERVICE') private readonly branchClient: ClientKafka,
  ) {}

  @Post(':restaurantId')
  async createBranch(
    @Req() req: any,
    @Body() data: CreateBranchDto,
    @Param('restaurantId') restaurantId: number,
    @Res() res: Response,
  ) {
    this.branchClient.emit('create-branch', { ...data, restaurantId });
    return res
      .status(HttpStatus.CREATED)
      .json({ message: 'Branch created successfully' });
  }

  // @Get()
  // async getBranches(
  //   @Req() req: any,
  //     @Param('restaurantId') restaurantId: number,
  //   @Res() res: Response,
  // ) {
  // }
}
