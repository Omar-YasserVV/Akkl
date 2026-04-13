import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
import {
  DietaryType,
  Prisma,
  PrismaClient,
  UserRole,
} from '../generated/client/client';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

// Initialize client with the required adapter argument
const prisma = new PrismaClient({
  adapter: new PrismaPg(process.env.DATABASE_URL),
});

async function ensureDietaryTag(name: DietaryType) {
  const existing = await prisma.dietaryTag.findFirst({ where: { name } });
  if (existing) return existing;
  return prisma.dietaryTag.create({ data: { name } });
}

async function main() {
  console.log('--- 🚀 Start Comprehensive Seeding ---');

  // 1. Create Business Owner
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

  // 2. Create Restaurant
  const restaurant = await prisma.restaurant.upsert({
    where: { name: 'The Burger Joint' },
    update: {},
    create: {
      name: 'The Burger Joint',
      ownerId: owner.id,
    },
  });

  // 3. Create Branch
  const branch = await prisma.branch.upsert({
    where: { address: '123 Main St, City Center' },
    update: {
      haveTables: true,
      haveWarehouses: true,
      haveReservations: true,
    },
    create: {
      restaurantId: restaurant.id,
      branchNumber: 'B001',
      name: 'Main Downtown Branch',
      address: '123 Main St, City Center',
      haveTables: true,
      haveWarehouses: true,
      haveReservations: true,
    },
  });

  const branchId = branch.id;

  // 4. Create Dietary Tags
  const tags = await Promise.all(
    Object.values(DietaryType).map((tag) => ensureDietaryTag(tag)),
  );
  const veganTag = tags.find((t) => t.name === DietaryType.VEGAN)!;

  // 5. Create Ingredients
  const bun = await prisma.ingredient.upsert({
    where: { name: 'Vegan Bun' },
    update: {},
    create: { name: 'Vegan Bun', unit: 'piece' },
  });

  const patty = await prisma.ingredient.upsert({
    where: { name: 'Plant-Based Patty' },
    update: {},
    create: { name: 'Plant-Based Patty', unit: 'kg' },
  });

  // 6. Create Warehouse
  let warehouse = await prisma.warehouse.findFirst({
    where: { name: 'Main Cold Storage', branchId },
  });

  if (!warehouse) {
    warehouse = await prisma.warehouse.create({
      data: {
        name: 'Main Cold Storage',
        branchId,
        items: {
          create: [
            { ingredientId: bun.id, quantity: 100 },
            { ingredientId: patty.id, quantity: 50 },
          ],
        },
      },
    });
  }

  // 7. Create Branch Menu Item
  // Manual check-then-create because @@unique constraint is not present in schema
  let menuItem = await prisma.branchMenuItem.findFirst({
    where: {
      branchId: branchId,
      menuItemId: 101,
    },
  });

  if (!menuItem) {
    menuItem = await prisma.branchMenuItem.create({
      data: {
        branchId,
        menuItemId: 101,
        name: 'Signature Vegan Burger',
        description: 'A delicious plant-based patty burger.',
        isAvailable: true,
        variations: {
          create: [
            { size: 'Regular', price: new Prisma.Decimal('10.00') },
            { size: 'Double Stack', price: new Prisma.Decimal('15.00') },
          ],
        },
        dietaryTags: { connect: { id: veganTag.id } },
        recipe: {
          create: [
            { ingredientId: bun.id, quantityRequired: 1 },
            { ingredientId: patty.id, quantityRequired: 0.15 },
          ],
        },
      },
    });
    console.log('✅ Created BranchMenuItem');
  }

  // 8. Create Tables
  await prisma.table.upsert({
    where: { tableNumber_branchId: { tableNumber: 'T1', branchId } },
    update: {},
    create: {
      tableNumber: 'T1',
      capacity: 4,
      branchId,
    },
  });

  // 9. Create a Sample Order
  const orderCount = await prisma.order.count({ where: { userId: owner.id } });
  if (orderCount === 0) {
    await prisma.order.create({
      data: {
        totalPrice: new Prisma.Decimal('25.00'),
        itemCount: 2,
        branchId,
        userId: owner.id,
        status: 'COMPLETED',
        items: {
          create: [
            {
              menuItemId: menuItem.id,
              quantity: 2,
              price: new Prisma.Decimal('12.50'),
            },
          ],
        },
      },
    });
  }

  // 10. Create an Expense
  await prisma.expense.create({
    data: {
      amount: new Prisma.Decimal('500.00'),
      category: 'RENT',
      description: 'Monthly rent for store premises',
      branchId,
    },
  });

  console.log('--- ✅ Seeding Finished Successfully ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
