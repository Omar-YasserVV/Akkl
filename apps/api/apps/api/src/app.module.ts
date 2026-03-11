import { ConfigurableModuleBuilder, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth/auth.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { BranchModule } from './branch/branch.module';
import { DbModule } from '@app/db';
import { GuardsModule } from '@app/guards';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core/constants';
import { RolesGuard } from '@app/guards/role.guard';

@Module({
  imports: [
    DbModule,
    AuthModule,
    RestaurantModule,
    BranchModule,
    GuardsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7h' },
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
