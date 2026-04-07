import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/client/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('Successfully connected to Neon DB');
    } catch (e) {
      console.error('Failed to connect to Neon DB:', e);
    }
  }
}
