import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { BranchModule } from './branch/branch.module';
import { DbModule } from '@app/db';
import { GuardsModule } from '@app/guards';
import { JwtModule } from '@nestjs/jwt';

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
  providers: [],
})
export class AppModule {}
