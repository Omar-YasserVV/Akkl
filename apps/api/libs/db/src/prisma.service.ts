import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const dbUrl = process.env.DATABASE_URL;

    if (!dbUrl) {
      throw new Error(
        'DATABASE_URL is not defined in the environment variables',
      );
    }

    // Prisma 7 setup using the 'pg' driver and adapter
    const pool = new Pool({ connectionString: dbUrl });
    const adapter = new PrismaPg(pool);

    // Pass the adapter to the PrismaClient constructor
    super({ adapter });
  }

  async onModuleInit() {
    // This establishes the connection and wakes up Neon instances
    await this.$connect();
  }
}
