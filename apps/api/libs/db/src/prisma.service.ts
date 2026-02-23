import { Injectable, OnModuleInit } from '@nestjs/common';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
// Import from your NEW generated folder
import { PrismaClient } from '../generated/client/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    super({ adapter }); // Pass the adapter to Prisma 7
  }

  async onModuleInit() {
    await this.$connect();
  }
}
