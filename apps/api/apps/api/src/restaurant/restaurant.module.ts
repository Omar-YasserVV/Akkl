import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RestaurantController } from './restaurant.controller';
import { GuardsModule } from '@app/guards';
import { JwtAuthGuard } from '@app/guards/jwt-auth.guard';
import { RolesGuard } from '@app/guards/role.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    GuardsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ClientsModule.register([
      {
        name: 'RESTAURANT_SERVICE',
        transport: Transport.TCP,
        options: { host: '127.0.0.1', port: 9011 },
      },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7h' },
    }),
  ],
  controllers: [RestaurantController],
  providers: [JwtAuthGuard, RolesGuard],
})
export class RestaurantModule {}
