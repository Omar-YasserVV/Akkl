import { GuardsModule } from '@app/guards';
import { JwtAuthGuard } from '@app/guards/jwt-auth.guard';
import { RolesGuard } from '@app/guards/role.guard';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { createKafkaClient } from 'utils/kafka-client.factory';
import { BranchController } from './branch.controller';
import { BranchGateway } from './branch.gateway';

@Module({
  imports: [
    GuardsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ClientsModule.registerAsync(
      createKafkaClient('BRANCH_SERVICE', 'api-gateway-branch-group'),
    ),
  ],
  controllers: [BranchController],
  providers: [JwtAuthGuard, RolesGuard, BranchGateway],
})
export class BranchModule {}
