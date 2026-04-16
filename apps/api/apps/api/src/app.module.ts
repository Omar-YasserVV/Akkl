import { GuardsModule } from '@app/guards';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AnalyticsModule } from './analytics/analytics.module';

import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { BranchModule } from './branch/branch.module';
import { RestaurantModule } from './restaurant/restaurant.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    GuardsModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7h' },
    }),
    // Feature modules
    AuthModule,
    RestaurantModule,
    BranchModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
