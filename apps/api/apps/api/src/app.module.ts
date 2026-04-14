import { DbModule } from '@app/db';
import { GuardsModule } from '@app/guards';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AnalyticsModule } from './analytics/analytics.module';
import { AuthModule } from './auth/auth.module';
import { BranchModule } from './branch/branch.module';
import { RestaurantModule } from './restaurant/restaurant.module';

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
    AnalyticsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
