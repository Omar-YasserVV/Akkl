import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
import {
  DietaryType,
  ExpenseType,
  OrderState,
  PrismaClient,
  ShiftStatus,
  source,
  UserRole,
} from '../generated/client/client';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg(process.env.DATABASE_URL),
});

async function main() {
  console.log('🚀 Starting Seeding process...');

  // --- 1. Cleanup existing data ---
  // Order matters due to Foreign Key constraints (Child tables first)
  await prisma.expense.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.inventoryItem.deleteMany({});
  await prisma.recipe.deleteMany({});
  await prisma.menuItemVariation.deleteMany({});
  await prisma.branchMenuItem.deleteMany({});
  await prisma.reservation.deleteMany({});
  await prisma.table.deleteMany({});
  await prisma.shift.deleteMany({});
  await prisma.warehouse.deleteMany({});
  await prisma.branch.deleteMany({});
  await prisma.restaurant.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.systemAdmin.deleteMany({});

  // --- 2. System Admins ---
  await prisma.systemAdmin.create({
    data: {
      email: 'admin@akkl.com',
      password: 'hashed_password_here',
    },
  });

  // --- 3. Users (Owners, Staff, and Customers) ---
  const owner = await prisma.user.create({
    data: {
      email: 'omar@owner.com',
      username: 'omar_yasser',
      password: 'hashed_password',
      fullName: 'Omar Yasser Shawky',
      phone: '01000000001',
      role: UserRole.BUSINESS_OWNER,
    },
  });

  const manager = await prisma.user.create({
    data: {
      email: 'manager@branch.com',
      username: 'branch_mgr',
      password: 'hashed_password',
      fullName: 'Ahmed Manager',
      phone: '01000000002',
      role: UserRole.MANAGER,
      salary: 5000.0,
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: 'customer@gmail.com',
      username: 'foodie_jane',
      password: 'hashed_password',
      fullName: 'Jane Doe',
      phone: '01000000003',
      role: UserRole.CUSTOMER,
    },
  });

  // --- 4. Restaurants ---
  const restaurant = await prisma.restaurant.create({
    data: {
      name: 'The Elite Burger',
      logoUrl: 'https://example.com/logo.png',
      ownerId: owner.id,
    },
  });

  // --- 5. Branches ---
  const branch = await prisma.branch.create({
    data: {
      name: 'Downtown Branch',
      branchNumber: 'BR-001',
      address: '123 Tech Street, 10th of Ramadan City',
      restaurantId: restaurant.id,
      haveTables: true,
      haveReservations: true,
      haveWarehouses: true,
    },
  });

  // Update manager to belong to this branch
  await prisma.user.update({
    where: { id: manager.id },
    data: { branchId: branch.id },
  });

  // --- 6. Tables & Reservations ---
  const table = await prisma.table.create({
    data: {
      tableNumber: 'T1',
      capacity: 4,
      branchId: branch.id,
    },
  });

  await prisma.reservation.create({
    data: {
      reservationTime: new Date(Date.now() + 86400000), // Tomorrow
      depositAmount: 50.0,
      isPaid: true,
      tableId: table.id,
      branchId: branch.id,
      userId: customer.id,
    },
  });

  // --- 7. Inventory & Warehouses ---
  const warehouse = await prisma.warehouse.create({
    data: {
      name: 'Main Cold Storage',
      branchId: branch.id,
    },
  });

  const ingredient = await prisma.ingredient.upsert({
    where: { name: 'Premium Beef Patty' },
    update: {},
    create: {
      name: 'Premium Beef Patty',
      unit: 'kg',
    },
  });

  await prisma.inventoryItem.create({
    data: {
      ingredientId: ingredient.id,
      quantity: 150.5,
      warehouseId: warehouse.id,
    },
  });

  // --- 8. Menu & Recipes ---
  const menuItem = await prisma.branchMenuItem.create({
    data: {
      branchId: branch.id,
      menuItemId: crypto.randomUUID(),
      name: 'Double Cheeseburger',
      description: 'The signature beef burger with extra cheese',
      isAvailable: true,
      dietaryTags: {
        create: [{ name: DietaryType.DAIRY_FREE }],
      },
    },
  });

  await prisma.menuItemVariation.create({
    data: {
      size: 'Large',
      price: 12.99,
      discountPrice: 10.99,
      branchMenuItemId: menuItem.id,
    },
  });

  await prisma.recipe.create({
    data: {
      menuItemId: menuItem.id,
      ingredientId: ingredient.id,
      quantityRequired: 0.25,
    },
  });

  // --- 9. Orders ---
  await prisma.order.create({
    data: {
      totalPrice: 21.98,
      itemCount: 2,
      branchId: branch.id,
      userId: customer.id,
      CustomerName: 'Jane Doe',
      source: source.APP,
      status: OrderState.PENDING,
      items: {
        create: [
          {
            menuItemId: menuItem.id,
            quantity: 2,
            price: 10.99,
          },
        ],
      },
    },
  });

  // --- 10. Shifts & Expenses ---
  await prisma.shift.create({
    data: {
      userId: manager.id,
      branchId: branch.id,
      status: ShiftStatus.ACTIVE,
      startTime: new Date(),
    },
  });

  await prisma.expense.create({
    data: {
      amount: 2500.0,
      category: ExpenseType.RENT,
      description: 'Monthly branch rent',
      branchId: branch.id,
    },
  });

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
