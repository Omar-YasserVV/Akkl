import * as dotenv from 'dotenv';
import { PrismaPg } from '@prisma/adapter-pg';
import {
  PrismaClient,
  DietaryType,
  UserRole,
  Prisma,
} from '../generated/client/client';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg(process.env.DATABASE_URL),
});

async function ensureDietaryTag(name: DietaryType) {
  const existing = await prisma.dietaryTag.findFirst({ where: { name } });
  if (existing) return existing;
  return prisma.dietaryTag.create({ data: { name } });
}

async function main() {
  console.log('--- Start Seeding ---');

  const owner = await prisma.user.upsert({
    where: { email: 'owner@example.com' },
    update: {},
    create: {
      email: 'owner@example.com',
      username: 'restaurant_boss',
      password: 'hashed_password_here',
      fullName: 'John Doe',
      phone: '1234567890',
      role: UserRole.BUSINESS_OWNER,
    },
  });

  const restaurant = await prisma.restaurant.upsert({
    where: { name: 'The Burger Joint' },
    update: {},
    create: {
      name: 'The Burger Joint',
      ownerId: owner.id,
    },
  });

  let branch = await prisma.branch.findFirst({
    where: { restaurantId: restaurant.id, branchNumber: 'B001' },
  });
  if (!branch) {
    branch = await prisma.branch.create({
      data: {
        restaurantId: restaurant.id,
        branchNumber: 'B001',
        name: 'Main Downtown Branch',
        address: '123 Main St, City Center',
        haveTables: true,
      },
    });
  }

  const branchId = branch.id;

  const tags = await Promise.all(
    Object.values(DietaryType).map((tag) => ensureDietaryTag(tag)),
  );

  const veganTag = tags.find((t) => t.name === DietaryType.VEGAN);
  const dairyFreeTag = tags.find((t) => t.name === DietaryType.DAIRY_FREE);
  if (!veganTag || !dairyFreeTag) {
    throw new Error('Missing dietary tags for seed');
  }

  const menuData = {
    name: 'Signature Vegan Burger',
    description: 'A delicious plant-based patty with avocado and sprouts.',
    image: 'https://images.unsplash.com/photo-1512152272829-e3139592d56f',
    variations: {
      create: [
        { size: 'Standard', price: new Prisma.Decimal('12.99') },
        {
          size: 'Large',
          price: new Prisma.Decimal('15.99'),
          discountPrice: new Prisma.Decimal('13.99'),
        },
      ],
    },
    dietaryTags: {
      connect: [{ id: veganTag.id }, { id: dairyFreeTag.id }],
    },
  };

  await prisma.branchMenuItem.upsert({
    where: {
      branchId_menuItemId: {
        branchId,
        menuItemId: 101,
      },
    },
    update: {
      name: menuData.name,
      description: menuData.description,
      image: menuData.image,
      dietaryTags: {
        set: [{ id: veganTag.id }, { id: dairyFreeTag.id }],
      },
    },
    create: {
      branchId,
      menuItemId: 101,
      ...menuData,
    },
  });

  console.log('--- Seeding Finished Successfully ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
