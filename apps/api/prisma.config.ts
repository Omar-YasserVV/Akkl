import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: './libs/db/prisma/schema.prisma',
  migrations: {
    path: './libs/db/prisma/migrations',
    seed: 'pnpm exec ts-node -r tsconfig-paths/register libs/db/prisma/seed.ts',
  },
  datasource: {
    url: process.env['DATABASE_URL'],
  },
});
