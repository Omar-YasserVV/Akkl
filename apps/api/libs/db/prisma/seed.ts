import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
import {
  DietaryType,
  ExpenseType,
  IngredientCategory,
  MeasurementUnit,
  OrderState,
  PrismaClient,
  ShiftStatus,
  source,
  stockStatus,
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

  // --- 1. Cleanup existing data (order matters — children before parents) ---
  await prisma.inventoryUsageLog.deleteMany({});
  await prisma.stockBatch.deleteMany({});
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
  await prisma.ingredient.deleteMany({});
  await prisma.dietaryTag.deleteMany({});
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

  // --- 3. Users ---
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

  // --- 4. Restaurant ---
  const restaurant = await prisma.restaurant.create({
    data: {
      name: 'The Elite Burger',
      logoUrl: 'https://example.com/logo.png',
      ownerId: owner.id,
    },
  });

  // --- 5. Branch ---
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
      reservationTime: new Date(Date.now() + 86400000),
      depositAmount: 50.0,
      isPaid: true,
      tableId: table.id,
      branchId: branch.id,
      userId: customer.id,
    },
  });

  // --- 7. Warehouse & Ingredients ---
  const warehouse = await prisma.warehouse.create({
    data: {
      name: 'Main Cold Storage',
      branchId: branch.id,
    },
  });

  const beefPatty = await prisma.ingredient.upsert({
    where: { name: 'Premium Beef Patty' },
    update: {},
    create: {
      name: 'Premium Beef Patty',
      unit: MeasurementUnit.KG,
      category: IngredientCategory.MEAT,
    },
  });

  const cheeseSlab = await prisma.ingredient.upsert({
    where: { name: 'Cheddar Cheese Slab' },
    update: {},
    create: {
      name: 'Cheddar Cheese Slab',
      unit: MeasurementUnit.KG,
      category: IngredientCategory.DAIRY,
    },
  });

  const briocheBun = await prisma.ingredient.upsert({
    where: { name: 'Brioche Bun' },
    update: {},
    create: {
      name: 'Brioche Bun',
      unit: MeasurementUnit.PCS,
      category: IngredientCategory.BAKERY,
    },
  });

  // --- 8. Inventory Items + Stock Batches ---
  // InventoryItem registers the ingredient+warehouse slot (quantity starts at 0)
  // StockBatch represents the actual physical delivery
  // After creating batches, we sync the item quantity to match

  const beefItem = await prisma.inventoryItem.create({
    data: {
      ingredientId: beefPatty.id,
      warehouseId: warehouse.id,
      quantity: 0,
      minimumQuantity: 20,
      stockStatus: stockStatus.OUT_OF_STOCK,
    },
  });

  const cheeseItem = await prisma.inventoryItem.create({
    data: {
      ingredientId: cheeseSlab.id,
      warehouseId: warehouse.id,
      quantity: 0,
      minimumQuantity: 10,
      stockStatus: stockStatus.OUT_OF_STOCK,
    },
  });

  const bunItem = await prisma.inventoryItem.create({
    data: {
      ingredientId: briocheBun.id,
      warehouseId: warehouse.id,
      quantity: 0,
      minimumQuantity: 30,
      stockStatus: stockStatus.OUT_OF_STOCK,
    },
  });

  // Create stock batches (one opening delivery per item)
  await prisma.stockBatch.createMany({
    data: [
      {
        inventoryItemId: beefItem.id,
        initialQuantity: 150.5,
        remainingQuantity: 150.5,
        numberOfUnits: 15, // 15 bags
        unitSize: 10, // 10kg each
        costPerUnit: 9.0, // $9 per kg
        receivedAt: new Date(),
        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
      },
      {
        inventoryItemId: cheeseItem.id,
        initialQuantity: 60.0,
        remainingQuantity: 60.0,
        numberOfUnits: 12, // 12 blocks
        unitSize: 5, // 5kg each
        costPerUnit: 13.0, // $13 per kg
        receivedAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
      {
        inventoryItemId: bunItem.id,
        initialQuantity: 200,
        remainingQuantity: 200,
        numberOfUnits: 10, // 10 packs
        unitSize: 20, // 20 buns each
        costPerUnit: 0.3, // $0.30 per bun
        receivedAt: new Date(),
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
      },
    ],
  });

  // Sync InventoryItem.quantity and stockStatus from batch totals
  await Promise.all([
    prisma.inventoryItem.update({
      where: { id: beefItem.id },
      data: { quantity: 150.5, stockStatus: stockStatus.IN_STOCK },
    }),
    prisma.inventoryItem.update({
      where: { id: cheeseItem.id },
      data: { quantity: 60.0, stockStatus: stockStatus.IN_STOCK },
    }),
    prisma.inventoryItem.update({
      where: { id: bunItem.id },
      data: { quantity: 200, stockStatus: stockStatus.IN_STOCK },
    }),
  ]);

  // --- 9. Menu & Recipes ---
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

  await prisma.recipe.createMany({
    data: [
      {
        menuItemId: menuItem.id,
        ingredientId: beefPatty.id,
        quantityRequired: 0.25,
      },
      {
        menuItemId: menuItem.id,
        ingredientId: cheeseSlab.id,
        quantityRequired: 0.05,
      },
      {
        menuItemId: menuItem.id,
        ingredientId: briocheBun.id,
        quantityRequired: 1,
      },
    ],
  });

  // --- 10. Orders ---
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
        create: [{ menuItemId: menuItem.id, quantity: 2, price: 10.99 }],
      },
    },
  });

  // --- 11. Shifts & Expenses ---
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
