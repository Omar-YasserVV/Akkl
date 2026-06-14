import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

import { hashPassword } from 'utils/argon2';
import {
  BatchStatus,
  BranchStatus,
  DietaryType,
  ExpenseType,
  HardwareType,
  IngredientCategory,
  InventoryLogAction,
  MeasurementUnit,
  MenuCategory,
  OrderSource,
  OrderState,
  PrismaClient,
  ShiftStatus,
  StockStatus,
  UserRole,
} from '../generated/client/client';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg(process.env.DATABASE_URL),
});

// -------------------------------------------------------
// HELPERS
// -------------------------------------------------------

/** Return a random element from an array */
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

/** Return a random integer between min and max (inclusive) */
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Build a realistic Date within a given calendar day.
 * Weekends & Thursdays skew toward dinner (18-23h).
 * Weekdays spread across lunch (11-14h) and dinner (18-22h).
 */
function orderTimeForDay(date: Date): Date {
  const dow = date.getDay(); // 0=Sun … 6=Sat
  const isWeekend = dow === 5 || dow === 6 || dow === 4; // Thu-Fri-Sat busy

  let hour: number;
  const r = Math.random();
  if (isWeekend) {
    // 10% breakfast, 30% lunch, 60% dinner
    if (r < 0.1) hour = randInt(9, 11);
    else if (r < 0.4) hour = randInt(12, 15);
    else hour = randInt(18, 23);
  } else {
    // 5% breakfast, 45% lunch, 50% dinner
    if (r < 0.05) hour = randInt(9, 10);
    else if (r < 0.5) hour = randInt(11, 14);
    else hour = randInt(18, 22);
  }

  const result = new Date(date);
  result.setHours(hour, randInt(0, 59), randInt(0, 59), 0);
  return result;
}

/**
 * How many orders should this day generate?
 * Weekends: 18-30, weekdays: 8-18, with a gentle upward trend
 * across the 60 days to simulate growth.
 */
function ordersForDay(date: Date, dayIndex: number): number {
  const dow = date.getDay();
  const isWeekend = dow === 5 || dow === 6 || dow === 4;
  const growthBonus = Math.floor(dayIndex / 10); // +1 every 10 days

  return isWeekend
    ? randInt(18, 30) + growthBonus
    : randInt(8, 18) + growthBonus;
}

/**
 * Weighted random order status.
 * Historical orders are mostly COMPLETED; some CANCELLED.
 */
function historicalStatus(): OrderState {
  const r = Math.random();
  if (r < 0.78) return OrderState.COMPLETED;
  if (r < 0.92) return OrderState.CANCELLED;
  if (r < 0.96) return OrderState.IN_PROGRESS;
  return OrderState.PENDING;
}

// -------------------------------------------------------
// MAIN
// -------------------------------------------------------
async function main() {
  console.log('🚀 Starting Seeding process...');

  // -------------------------------------------------------
  // 1. CLEANUP
  // -------------------------------------------------------
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
  await prisma.hardware.deleteMany({});
  await prisma.shift.deleteMany({});
  await prisma.warehouse.deleteMany({});
  await prisma.ingredient.deleteMany({});
  await prisma.dietaryTag.deleteMany({});
  await prisma.tokenBlacklist.deleteMany({});
  await prisma.branch.deleteMany({});
  await prisma.restaurant.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.systemAdmin.deleteMany({});

  console.log('🧹 Cleanup done');

  // -------------------------------------------------------
  // 2. SYSTEM ADMIN
  // -------------------------------------------------------
  await prisma.systemAdmin.create({
    data: {
      email: 'admin@akkl.com',
      password: 'hashed_admin_password',
      lastLogin: new Date(),
    },
  });
  console.log('✅ System admin created');

  // -------------------------------------------------------
  // 3. USERS
  // -------------------------------------------------------
  const passwords = {
    owner: 'owner123',
    manager: 'manager123',
    cashier: 'cashier123',
    chief: 'chief123',
    waiter: 'waiter123',
    customer: 'customer123',
    customer2: 'customer2123',
  };

  const [
    ownerHashed,
    managerHashed,
    cashierHashed,
    chiefHashed,
    waiterHashed,
    customerHashed,
    customer2Hashed,
  ] = await Promise.all([
    hashPassword(passwords.owner),
    hashPassword(passwords.manager),
    hashPassword(passwords.cashier),
    hashPassword(passwords.chief),
    hashPassword(passwords.waiter),
    hashPassword(passwords.customer),
    hashPassword(passwords.customer2),
  ]);

  const owner = await prisma.user.create({
    data: {
      email: 'omar@owner.com',
      username: 'omar_yasser',
      password: ownerHashed,
      fullName: 'Omar Yasser Shawky',
      phone: '01000000001',
      role: UserRole.BUSINESS_OWNER,
    },
  });

  const manager = await prisma.user.create({
    data: {
      email: 'manager@branch.com',
      username: 'branch_mgr',
      password: managerHashed,
      fullName: 'Ahmed Manager',
      phone: '01000000002',
      role: UserRole.MANAGER,
      salary: 5000.0,
    },
  });

  const cashier = await prisma.user.create({
    data: {
      email: 'cashier@branch.com',
      username: 'branch_cashier',
      password: cashierHashed,
      fullName: 'Sara Cashier',
      phone: '01000000004',
      role: UserRole.CASHIER,
      salary: 3000.0,
    },
  });

  const chief = await prisma.user.create({
    data: {
      email: 'chief@branch.com',
      username: 'branch_chief',
      password: chiefHashed,
      fullName: 'Hassan Chief',
      phone: '01000000005',
      role: UserRole.CHIEF,
      salary: 4500.0,
    },
  });

  const waiter = await prisma.user.create({
    data: {
      email: 'waiter@branch.com',
      username: 'branch_waiter',
      password: waiterHashed,
      fullName: 'Mostafa Waiter',
      phone: '01000000006',
      role: UserRole.WAITER,
      salary: 2500.0,
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: 'customer@gmail.com',
      username: 'foodie_jane',
      password: customerHashed,
      fullName: 'Jane Doe',
      phone: '01000000003',
      role: UserRole.CUSTOMER,
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      email: 'customer2@gmail.com',
      username: 'hungry_john',
      password: customer2Hashed,
      fullName: 'John Smith',
      phone: '01000000007',
      role: UserRole.CUSTOMER,
    },
  });

  console.log('✅ Users created');

  // -------------------------------------------------------
  // 4. RESTAURANT
  // -------------------------------------------------------
  const restaurant = await prisma.restaurant.create({
    data: {
      name: 'The Elite Burger',
      logoUrl: 'https://example.com/logo.png',
      ownerId: owner.id,
    },
  });
  console.log('✅ Restaurant created');

  // -------------------------------------------------------
  // 5. BRANCH
  // -------------------------------------------------------
  const branch = await prisma.branch.create({
    data: {
      name: 'Downtown Branch',
      branchNumber: 'BR-001',
      address: '123 Tech Street, 10th of Ramadan City',
      phone: '01555123456',
      latitude: 30.3082,
      longitude: 31.7428,
      status: BranchStatus.ACTIVE,
      restaurantId: restaurant.id,
      haveTables: true,
      haveReservations: true,
      haveWarehouses: true,
      weeklyHours: {
        monday: '09:00 AM - 10:00 PM',
        tuesday: '09:00 AM - 10:00 PM',
        wednesday: '09:00 AM - 10:00 PM',
        thursday: '09:00 AM - 11:00 PM',
        friday: '10:00 AM - 12:00 AM',
        saturday: '10:00 AM - 12:00 AM',
        sunday: 'CLOSED',
      },
      busyModeSettings: {
        autoBusyEnabled: true,
        orderThreshold: 15,
        extraPrepTimeMinutes: 10,
      },
    },
  });

  await prisma.user.updateMany({
    where: { id: { in: [manager.id, cashier.id, chief.id, waiter.id] } },
    data: { branchId: branch.id },
  });

  console.log('✅ Branch created');

  // -------------------------------------------------------
  // 6. HARDWARE
  // -------------------------------------------------------
  await prisma.hardware.createMany({
    data: [
      {
        branchId: branch.id,
        type: HardwareType.KDS,
        name: 'KitchenLine 01',
        ipAddress: '192.168.1.101',
      },
      {
        branchId: branch.id,
        type: HardwareType.KDS,
        name: 'Prep Station B',
        ipAddress: '192.168.1.102',
      },
      {
        branchId: branch.id,
        type: HardwareType.PRINTER,
        name: 'Main Bar Thermal',
        ipAddress: '192.168.1.150',
      },
    ],
  });
  console.log('✅ Hardware profiles created');

  // -------------------------------------------------------
  // 7. DIETARY TAGS
  // -------------------------------------------------------
  const veganTag = await prisma.dietaryTag.create({
    data: { name: DietaryType.VEGAN },
  });
  const glutenFreeTag = await prisma.dietaryTag.create({
    data: { name: DietaryType.GLUTEN_FREE },
  });
  const dairyFreeTag = await prisma.dietaryTag.create({
    data: { name: DietaryType.DAIRY_FREE },
  });
  console.log('✅ Dietary tags created');

  // -------------------------------------------------------
  // 8. TABLES & RESERVATIONS
  // -------------------------------------------------------
  const table1 = await prisma.table.create({
    data: {
      tableNumber: 'Table 1',
      capacity: 4,
      zoneName: 'Indoor Dining',
      branchId: branch.id,
    },
  });
  const table2 = await prisma.table.create({
    data: {
      tableNumber: 'Table 2',
      capacity: 2,
      zoneName: 'Indoor Dining',
      branchId: branch.id,
    },
  });
  const table3 = await prisma.table.create({
    data: {
      tableNumber: 'Patio 1',
      capacity: 6,
      zoneName: 'Outdoor Patio',
      branchId: branch.id,
    },
  });

  await prisma.reservation.createMany({
    data: [
      {
        reservationTime: new Date(Date.now() + 86400000),
        depositAmount: 50.0,
        isPaid: true,
        tableId: table1.id,
        branchId: branch.id,
        userId: customer.id,
      },
      {
        reservationTime: new Date(Date.now() + 2 * 86400000),
        depositAmount: 30.0,
        isPaid: false,
        tableId: table2.id,
        branchId: branch.id,
        userId: customer2.id,
      },
      {
        reservationTime: new Date(Date.now() + 3 * 86400000),
        depositAmount: 75.0,
        isPaid: false,
        tableId: table3.id,
        branchId: branch.id,
        userId: customer.id,
      },
    ],
  });
  console.log('✅ Tables & reservations created');

  // -------------------------------------------------------
  // 9. WAREHOUSE
  // -------------------------------------------------------
  const warehouse = await prisma.warehouse.create({
    data: { name: 'Main Cold Storage', branchId: branch.id },
  });
  console.log('✅ Warehouse created');

  // -------------------------------------------------------
  // 10. INGREDIENTS
  // -------------------------------------------------------
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
  const chickenBreast = await prisma.ingredient.upsert({
    where: { name: 'Chicken Breast' },
    update: {},
    create: {
      name: 'Chicken Breast',
      unit: MeasurementUnit.KG,
      category: IngredientCategory.MEAT,
    },
  });
  const lettuce = await prisma.ingredient.upsert({
    where: { name: 'Iceberg Lettuce' },
    update: {},
    create: {
      name: 'Iceberg Lettuce',
      unit: MeasurementUnit.KG,
      category: IngredientCategory.PRODUCE,
    },
  });
  const oliveOil = await prisma.ingredient.upsert({
    where: { name: 'Extra Virgin Olive Oil' },
    update: {},
    create: {
      name: 'Extra Virgin Olive Oil',
      unit: MeasurementUnit.L,
      category: IngredientCategory.OILS,
    },
  });
  const frenchFries = await prisma.ingredient.upsert({
    where: { name: 'Frozen French Fries' },
    update: {},
    create: {
      name: 'Frozen French Fries',
      unit: MeasurementUnit.KG,
      category: IngredientCategory.PRODUCE,
    },
  });
  console.log('✅ Ingredients created');

  // -------------------------------------------------------
  // 11. INVENTORY ITEMS
  // -------------------------------------------------------
  const beefItem = await prisma.inventoryItem.create({
    data: {
      ingredientId: beefPatty.id,
      warehouseId: warehouse.id,
      quantity: 500,
      minimumQuantity: 20,
      stockStatus: StockStatus.IN_STOCK,
    },
  });
  const cheeseItem = await prisma.inventoryItem.create({
    data: {
      ingredientId: cheeseSlab.id,
      warehouseId: warehouse.id,
      quantity: 300,
      minimumQuantity: 10,
      stockStatus: StockStatus.IN_STOCK,
    },
  });
  const bunItem = await prisma.inventoryItem.create({
    data: {
      ingredientId: briocheBun.id,
      warehouseId: warehouse.id,
      quantity: 1000,
      minimumQuantity: 30,
      stockStatus: StockStatus.IN_STOCK,
    },
  });
  const chickenItem = await prisma.inventoryItem.create({
    data: {
      ingredientId: chickenBreast.id,
      warehouseId: warehouse.id,
      quantity: 400,
      minimumQuantity: 15,
      stockStatus: StockStatus.IN_STOCK,
    },
  });
  const lettuceItem = await prisma.inventoryItem.create({
    data: {
      ingredientId: lettuce.id,
      warehouseId: warehouse.id,
      quantity: 200,
      minimumQuantity: 5,
      stockStatus: StockStatus.IN_STOCK,
    },
  });
  const oilItem = await prisma.inventoryItem.create({
    data: {
      ingredientId: oliveOil.id,
      warehouseId: warehouse.id,
      quantity: 100,
      minimumQuantity: 5,
      stockStatus: StockStatus.IN_STOCK,
    },
  });
  const friesItem = await prisma.inventoryItem.create({
    data: {
      ingredientId: frenchFries.id,
      warehouseId: warehouse.id,
      quantity: 500,
      minimumQuantity: 20,
      stockStatus: StockStatus.IN_STOCK,
    },
  });
  console.log('✅ Inventory items created');

  // -------------------------------------------------------
  // 12. STOCK BATCHES
  // -------------------------------------------------------
  await prisma.stockBatch.createMany({
    data: [
      {
        inventoryItemId: beefItem.id,
        initialQuantity: 500,
        remainingQuantity: 500,
        numberOfUnits: 50,
        unitSize: 10,
        costPerUnit: 9.0,
        receivedAt: new Date(Date.now() - 60 * 86400000),
        expiresAt: new Date(Date.now() + 30 * 86400000),
        status: BatchStatus.ACTIVE,
      },
      {
        inventoryItemId: cheeseItem.id,
        initialQuantity: 300,
        remainingQuantity: 300,
        numberOfUnits: 60,
        unitSize: 5,
        costPerUnit: 13.0,
        receivedAt: new Date(Date.now() - 60 * 86400000),
        expiresAt: new Date(Date.now() + 60 * 86400000),
        status: BatchStatus.ACTIVE,
      },
      {
        inventoryItemId: bunItem.id,
        initialQuantity: 1000,
        remainingQuantity: 1000,
        numberOfUnits: 50,
        unitSize: 20,
        costPerUnit: 0.3,
        receivedAt: new Date(Date.now() - 60 * 86400000),
        expiresAt: new Date(Date.now() + 10 * 86400000),
        status: BatchStatus.ACTIVE,
      },
      {
        inventoryItemId: chickenItem.id,
        initialQuantity: 400,
        remainingQuantity: 400,
        numberOfUnits: 40,
        unitSize: 10,
        costPerUnit: 7.5,
        receivedAt: new Date(Date.now() - 60 * 86400000),
        expiresAt: new Date(Date.now() + 20 * 86400000),
        status: BatchStatus.ACTIVE,
      },
      {
        inventoryItemId: lettuceItem.id,
        initialQuantity: 200,
        remainingQuantity: 200,
        numberOfUnits: 40,
        unitSize: 5,
        costPerUnit: 1.2,
        receivedAt: new Date(Date.now() - 60 * 86400000),
        expiresAt: new Date(Date.now() + 5 * 86400000),
        status: BatchStatus.ACTIVE,
      },
      {
        inventoryItemId: oilItem.id,
        initialQuantity: 100,
        remainingQuantity: 100,
        numberOfUnits: 20,
        unitSize: 5,
        costPerUnit: 8.0,
        receivedAt: new Date(Date.now() - 60 * 86400000),
        expiresAt: new Date(Date.now() + 180 * 86400000),
        status: BatchStatus.ACTIVE,
      },
      {
        inventoryItemId: friesItem.id,
        initialQuantity: 500,
        remainingQuantity: 500,
        numberOfUnits: 50,
        unitSize: 10,
        costPerUnit: 2.5,
        receivedAt: new Date(Date.now() - 60 * 86400000),
        expiresAt: new Date(Date.now() + 30 * 86400000),
        status: BatchStatus.ACTIVE,
      },
    ],
  });
  console.log('✅ Stock batches created');

  // -------------------------------------------------------
  // 13. MENU ITEMS
  // -------------------------------------------------------
  const burgerItem = await prisma.branchMenuItem.create({
    data: {
      branchId: branch.id,
      menuItemId: 'menu001',
      name: 'Double Cheeseburger',
      description: 'Signature beef burger with double cheddar cheese',
      category: MenuCategory.MAIN_COURSE,
      price: 12.99,
      discountPrice: 10.99,
      preparationTime: 12,
      isAvailable: true,
      dietaryTags: { connect: [{ id: dairyFreeTag.id }] },
      variations: {
        create: [
          { size: 'Regular', price: 9.99 },
          { size: 'Large', price: 12.99, discountPrice: 10.99 },
        ],
      },
    },
  });

  const chickenSandwich = await prisma.branchMenuItem.create({
    data: {
      branchId: branch.id,
      menuItemId: 'menu002',
      name: 'Crispy Chicken Sandwich',
      description: 'Crispy fried chicken breast with fresh lettuce',
      category: MenuCategory.MAIN_COURSE,
      price: 11.49,
      discountPrice: 9.99,
      preparationTime: 10,
      isAvailable: true,
      dietaryTags: { connect: [{ id: glutenFreeTag.id }] },
      variations: {
        create: [
          { size: 'Regular', price: 8.99 },
          { size: 'Large', price: 11.49, discountPrice: 9.99 },
        ],
      },
    },
  });

  const friesMenuItem = await prisma.branchMenuItem.create({
    data: {
      branchId: branch.id,
      menuItemId: 'menu003',
      name: 'Seasoned Fries',
      description: 'Crispy golden fries with house seasoning',
      category: MenuCategory.SIDE_DISH,
      price: 4.99,
      preparationTime: 6,
      isAvailable: true,
      dietaryTags: { connect: [{ id: veganTag.id }, { id: glutenFreeTag.id }] },
      variations: {
        create: [
          { size: 'Small', price: 3.49 },
          { size: 'Medium', price: 4.99 },
          { size: 'Large', price: 5.99, discountPrice: 4.99 },
        ],
      },
    },
  });

  const truffleBurger = await prisma.branchMenuItem.create({
    data: {
      branchId: branch.id,
      menuItemId: 'menu004',
      name: 'Truffle Burger',
      description: 'Premium wagyu beef with black truffle sauce',
      category: MenuCategory.MAIN_COURSE,
      price: 24.99,
      preparationTime: 18,
      isAvailable: false,
      variations: { create: [{ size: 'One Size', price: 24.99 }] },
    },
  });

  const chocLava = await prisma.branchMenuItem.create({
    data: {
      branchId: branch.id,
      menuItemId: 'menu005',
      name: 'Chocolate Lava Cake',
      description: 'Warm chocolate cake with a molten centre',
      category: MenuCategory.DESSERT,
      price: 6.99,
      preparationTime: 15,
      isAvailable: true,
      variations: {
        create: [
          { size: 'Single', price: 6.99, discountPrice: 5.99 },
          { size: 'Double', price: 12.99 },
        ],
      },
    },
  });

  const softDrink = await prisma.branchMenuItem.create({
    data: {
      branchId: branch.id,
      menuItemId: 'menu006',
      name: 'Soft Drink',
      description: 'Chilled can of your choice',
      category: MenuCategory.BEVERAGE,
      price: 2.49,
      preparationTime: 1,
      isAvailable: true,
      dietaryTags: { connect: [{ id: veganTag.id }] },
    },
  });

  const onionRings = await prisma.branchMenuItem.create({
    data: {
      branchId: branch.id,
      menuItemId: 'menu007',
      name: 'Onion Rings',
      description: 'Golden battered onion rings',
      category: MenuCategory.APPETIZER,
      price: 4.49,
      preparationTime: 8,
      isAvailable: true,
      dietaryTags: { connect: [{ id: veganTag.id }] },
    },
  });

  console.log('✅ Menu items created');

  // -------------------------------------------------------
  // 14. RECIPES
  // -------------------------------------------------------
  await prisma.recipe.createMany({
    data: [
      {
        menuItemId: burgerItem.id,
        ingredientId: beefPatty.id,
        quantityRequired: 0.25,
      },
      {
        menuItemId: burgerItem.id,
        ingredientId: cheeseSlab.id,
        quantityRequired: 0.05,
      },
      {
        menuItemId: burgerItem.id,
        ingredientId: briocheBun.id,
        quantityRequired: 1,
      },
      {
        menuItemId: chickenSandwich.id,
        ingredientId: chickenBreast.id,
        quantityRequired: 0.2,
      },
      {
        menuItemId: chickenSandwich.id,
        ingredientId: lettuce.id,
        quantityRequired: 0.05,
      },
      {
        menuItemId: chickenSandwich.id,
        ingredientId: briocheBun.id,
        quantityRequired: 1,
      },
      {
        menuItemId: chickenSandwich.id,
        ingredientId: oliveOil.id,
        quantityRequired: 0.02,
      },
      {
        menuItemId: friesMenuItem.id,
        ingredientId: frenchFries.id,
        quantityRequired: 0.3,
      },
      {
        menuItemId: friesMenuItem.id,
        ingredientId: oliveOil.id,
        quantityRequired: 0.01,
      },
      {
        menuItemId: truffleBurger.id,
        ingredientId: beefPatty.id,
        quantityRequired: 0.3,
      },
      {
        menuItemId: truffleBurger.id,
        ingredientId: briocheBun.id,
        quantityRequired: 1,
      },
      {
        menuItemId: onionRings.id,
        ingredientId: oliveOil.id,
        quantityRequired: 0.03,
      },
    ],
  });
  console.log('✅ Recipes created');

  // -------------------------------------------------------
  // 15. SHIFTS
  // -------------------------------------------------------
  await prisma.shift.createMany({
    data: [
      {
        userId: manager.id,
        branchId: branch.id,
        status: ShiftStatus.ACTIVE,
        startTime: new Date(),
      },
      {
        userId: cashier.id,
        branchId: branch.id,
        status: ShiftStatus.WORKING,
        startTime: new Date(Date.now() - 2 * 3600000),
      },
      {
        userId: chief.id,
        branchId: branch.id,
        status: ShiftStatus.COMPLETED,
        startTime: new Date(Date.now() - 9 * 3600000),
        endTime: new Date(Date.now() - 3600000),
      },
      {
        userId: waiter.id,
        branchId: branch.id,
        status: ShiftStatus.WORKING,
        startTime: new Date(Date.now() - 3 * 3600000),
      },
    ],
  });
  console.log('✅ Shifts created');

  // -------------------------------------------------------
  // 16. EXPENSES
  // -------------------------------------------------------
  await prisma.expense.createMany({
    data: [
      {
        amount: 2500.0,
        category: ExpenseType.RENT,
        description: 'Monthly branch rent - April',
        branchId: branch.id,
      },
      {
        amount: 850.0,
        category: ExpenseType.UTILITIES,
        description: 'Electricity & water bill',
        branchId: branch.id,
      },
      {
        amount: 3200.0,
        category: ExpenseType.INGREDIENTS,
        description: 'Weekly ingredient restock',
        branchId: branch.id,
      },
      {
        amount: 19500.0,
        category: ExpenseType.SALARY,
        description: 'Monthly staff salaries',
        branchId: branch.id,
      },
      {
        amount: 400.0,
        category: ExpenseType.MARKETING,
        description: 'Social media ads - April',
        branchId: branch.id,
      },
      {
        amount: 150.0,
        category: ExpenseType.LOSSES,
        description: 'Spoiled ingredients write-off',
        branchId: branch.id,
      },
    ],
  });
  console.log('✅ Expenses created');

  // -------------------------------------------------------
  // 17. DISCOVERY RESTAURANTS & BRANCHES
  // -------------------------------------------------------
  const napoliPizza = await prisma.restaurant.create({
    data: {
      name: 'Napoli Pizza House',
      logoUrl:
        'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200',
      ownerId: owner.id,
    },
  });
  const napoliCentral = await prisma.branch.create({
    data: {
      name: 'Central Hub',
      branchNumber: 'BR-002',
      address: '45 Central St, Downtown',
      phone: '01555123457',
      latitude: 30.312,
      longitude: 31.738,
      status: BranchStatus.ACTIVE,
      restaurantId: napoliPizza.id,
      weeklyHours: {
        monday: '10:00 AM - 10:00 PM',
        tuesday: '10:00 AM - 10:00 PM',
        wednesday: '10:00 AM - 10:00 PM',
        thursday: '10:00 AM - 11:00 PM',
        friday: '10:00 AM - 12:00 AM',
        saturday: '10:00 AM - 12:00 AM',
        sunday: '12:00 PM - 09:00 PM',
      },
    },
  });
  const napoliNorth = await prisma.branch.create({
    data: {
      name: 'North Plaza',
      branchNumber: 'BR-003',
      address: '88 North Ave, Heliopolis',
      phone: '01555123458',
      latitude: 30.318,
      longitude: 31.752,
      status: BranchStatus.ACTIVE,
      restaurantId: napoliPizza.id,
      weeklyHours: {
        monday: '09:00 AM - 09:00 PM',
        tuesday: '09:00 AM - 09:00 PM',
        wednesday: '09:00 AM - 09:00 PM',
        thursday: '09:00 AM - 10:00 PM',
        friday: '09:00 AM - 10:00 PM',
        saturday: '10:00 AM - 10:00 PM',
        sunday: 'CLOSED',
      },
    },
  });
  const sakuraSushi = await prisma.restaurant.create({
    data: {
      name: 'Sakura Sushi',
      logoUrl:
        'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200',
      ownerId: owner.id,
    },
  });
  const sakuraBranch = await prisma.branch.create({
    data: {
      name: 'Maadi Branch',
      branchNumber: 'BR-004',
      address: '12 Nile Corniche, Maadi',
      phone: '01555123459',
      latitude: 30.295,
      longitude: 31.728,
      status: BranchStatus.ACTIVE,
      restaurantId: sakuraSushi.id,
      weeklyHours: {
        monday: '11:00 AM - 11:00 PM',
        tuesday: '11:00 AM - 11:00 PM',
        wednesday: '11:00 AM - 11:00 PM',
        thursday: '11:00 AM - 11:00 PM',
        friday: '11:00 AM - 12:00 AM',
        saturday: '11:00 AM - 12:00 AM',
        sunday: '01:00 PM - 10:00 PM',
      },
    },
  });
  const greenBowl = await prisma.restaurant.create({
    data: {
      name: 'Green Bowl Salads',
      logoUrl:
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200',
      ownerId: owner.id,
    },
  });
  const greenBowlBranch = await prisma.branch.create({
    data: {
      name: 'Zamalek Branch',
      branchNumber: 'BR-005',
      address: '3 Hassan Sabry St, Zamalek',
      phone: '01555123460',
      latitude: 30.305,
      longitude: 31.715,
      status: BranchStatus.ACTIVE,
      restaurantId: greenBowl.id,
      weeklyHours: {
        monday: '08:00 AM - 09:00 PM',
        tuesday: '08:00 AM - 09:00 PM',
        wednesday: '08:00 AM - 09:00 PM',
        thursday: '08:00 AM - 09:00 PM',
        friday: '08:00 AM - 10:00 PM',
        saturday: '09:00 AM - 10:00 PM',
        sunday: '09:00 AM - 08:00 PM',
      },
    },
  });

  await prisma.branchMenuItem.createMany({
    data: [
      {
        branchId: napoliCentral.id,
        menuItemId: 'pizza-001',
        name: 'Margherita Pizza',
        description: 'Classic tomato, mozzarella, and fresh basil',
        category: MenuCategory.MAIN_COURSE,
        price: 145,
        discountPrice: 120,
        preparationTime: 20,
        isAvailable: true,
        image:
          'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
      },
      {
        branchId: napoliCentral.id,
        menuItemId: 'pizza-002',
        name: 'Pepperoni Feast',
        description: 'Loaded pepperoni with mozzarella',
        category: MenuCategory.MAIN_COURSE,
        price: 165,
        preparationTime: 22,
        isAvailable: true,
        image:
          'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
      },
      {
        branchId: napoliNorth.id,
        menuItemId: 'pizza-003',
        name: 'Four Cheese Pizza',
        description: 'Mozzarella, gorgonzola, parmesan, and ricotta',
        category: MenuCategory.MAIN_COURSE,
        price: 175,
        discountPrice: 149,
        preparationTime: 20,
        isAvailable: true,
      },
      {
        branchId: sakuraBranch.id,
        menuItemId: 'sushi-001',
        name: 'Salmon Nigiri Set',
        description: 'Fresh salmon nigiri with wasabi and ginger',
        category: MenuCategory.MAIN_COURSE,
        price: 220,
        discountPrice: 189,
        preparationTime: 15,
        isAvailable: true,
        image:
          'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
      },
      {
        branchId: sakuraBranch.id,
        menuItemId: 'sushi-002',
        name: 'Dragon Roll',
        description: 'Eel, avocado, and cucumber roll',
        category: MenuCategory.MAIN_COURSE,
        price: 195,
        preparationTime: 18,
        isAvailable: true,
      },
      {
        branchId: greenBowlBranch.id,
        menuItemId: 'salad-001',
        name: 'Quinoa Avocado Salad',
        description: 'Quinoa, avocado, cherry tomatoes, and lemon dressing',
        category: MenuCategory.MAIN_COURSE,
        price: 95,
        discountPrice: 79,
        preparationTime: 10,
        isAvailable: true,
        image:
          'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
      },
      {
        branchId: greenBowlBranch.id,
        menuItemId: 'salad-002',
        name: 'Vegan Power Bowl',
        description: 'Roasted chickpeas, kale, and tahini sauce',
        category: MenuCategory.MAIN_COURSE,
        price: 88,
        preparationTime: 12,
        isAvailable: true,
      },
    ],
  });

  const margherita = await prisma.branchMenuItem.findFirst({
    where: { branchId: napoliCentral.id, menuItemId: 'pizza-001' },
  });
  if (margherita) {
    await prisma.menuItemVariation.createMany({
      data: [
        {
          branchMenuItemId: margherita.id,
          size: 'Medium',
          price: 145,
          discountPrice: 120,
        },
        {
          branchMenuItemId: margherita.id,
          size: 'Large',
          price: 185,
          discountPrice: 155,
        },
      ],
    });
  }
  const salmonSet = await prisma.branchMenuItem.findFirst({
    where: { branchId: sakuraBranch.id, menuItemId: 'sushi-001' },
  });
  if (salmonSet) {
    await prisma.menuItemVariation.createMany({
      data: [
        {
          branchMenuItemId: salmonSet.id,
          size: '8 Pieces',
          price: 220,
          discountPrice: 189,
        },
        { branchMenuItemId: salmonSet.id, size: '12 Pieces', price: 295 },
      ],
    });
  }

  // suppress unused var warnings
  void napoliNorth;
  void sakuraBranch;
  void greenBowlBranch;
  void chocLava;
  void softDrink;

  console.log('✅ Discovery restaurants & menus created');

  // -------------------------------------------------------
  // 18. HISTORICAL ORDERS — 2 MONTHS (60 days back → today)
  // -------------------------------------------------------
  console.log('⏳ Generating 2 months of historical orders...');

  /**
   * Menu items available for the Downtown branch with their recipe-linked ingredients.
   * Each entry: { item, price, ingredients: [{ inventoryItemId, qtyPerUnit }] }
   */
  const MENU_CATALOG = [
    {
      item: burgerItem,
      price: 12.99,
      weight: 25, // relative order frequency
      ingredients: [
        { inventoryItemId: beefItem.id, qtyPerUnit: 0.25 },
        { inventoryItemId: cheeseItem.id, qtyPerUnit: 0.05 },
        { inventoryItemId: bunItem.id, qtyPerUnit: 1 },
      ],
    },
    {
      item: chickenSandwich,
      price: 11.49,
      weight: 22,
      ingredients: [
        { inventoryItemId: chickenItem.id, qtyPerUnit: 0.2 },
        { inventoryItemId: lettuceItem.id, qtyPerUnit: 0.05 },
        { inventoryItemId: bunItem.id, qtyPerUnit: 1 },
        { inventoryItemId: oilItem.id, qtyPerUnit: 0.02 },
      ],
    },
    {
      item: friesMenuItem,
      price: 4.99,
      weight: 30,
      ingredients: [
        { inventoryItemId: friesItem.id, qtyPerUnit: 0.3 },
        { inventoryItemId: oilItem.id, qtyPerUnit: 0.01 },
      ],
    },
    {
      item: onionRings,
      price: 4.49,
      weight: 12,
      ingredients: [{ inventoryItemId: oilItem.id, qtyPerUnit: 0.03 }],
    },
    {
      item: chocLava,
      price: 6.99,
      weight: 8,
      ingredients: [], // no tracked ingredients
    },
    {
      item: softDrink,
      price: 2.49,
      weight: 15,
      ingredients: [], // no tracked ingredients
    },
  ] as const;

  /** Weighted random menu item selection */
  const totalWeight = MENU_CATALOG.reduce((s, m) => s + m.weight, 0);
  function pickMenuItem() {
    let r = Math.random() * totalWeight;
    for (const m of MENU_CATALOG) {
      r -= m.weight;
      if (r <= 0) return m;
    }
    return MENU_CATALOG[0];
  }

  const users = [customer, customer2];
  const sources = [OrderSource.APP, OrderSource.STORE];

  // Running inventory tracker so usage logs have coherent prev/new quantities
  const runningQty: Record<string, number> = {
    [beefItem.id]: 500,
    [cheeseItem.id]: 300,
    [bunItem.id]: 1000,
    [chickenItem.id]: 400,
    [lettuceItem.id]: 200,
    [oilItem.id]: 100,
    [friesItem.id]: 500,
  };

  const NOW = Date.now();
  const START = NOW - 60 * 86400000; // 60 days ago

  let totalOrdersCreated = 0;
  let totalLogsCreated = 0;

  for (let dayIndex = 0; dayIndex < 60; dayIndex++) {
    const dayStart = new Date(START + dayIndex * 86400000);

    // Skip Sundays (branch closed per weeklyHours)
    if (dayStart.getDay() === 0) continue;

    const count = ordersForDay(dayStart, dayIndex);

    // We batch-create orders per day using sequential awaits
    // (createMany doesn't support nested relations)
    for (let i = 0; i < count; i++) {
      const orderTime = orderTimeForDay(dayStart);
      const user = pick(users);
      const status = historicalStatus();

      // Build 1-4 line items per order
      const lineItemCount = randInt(1, 4);
      const lineItems: {
        menuItemId: string;
        quantity: number;
        price: number;
        totalPrice: number;
      }[] = [];
      let orderTotal = 0;
      let orderItemCount = 0;

      for (let li = 0; li < lineItemCount; li++) {
        const catalog = pickMenuItem();
        const qty = randInt(1, 3);
        const price = catalog.price;
        const total = parseFloat((qty * price).toFixed(2));
        lineItems.push({
          menuItemId: catalog.item.id,
          quantity: qty,
          price,
          totalPrice: total,
        });
        orderTotal += total;
        orderItemCount += qty;
      }

      orderTotal = parseFloat(orderTotal.toFixed(2));

      const order = await prisma.order.create({
        data: {
          totalPrice: orderTotal,
          itemCount: orderItemCount,
          branchId: branch.id,
          userId: user.id,
          customerName: user.fullName,
          source: pick(sources),
          status,
          createdAt: orderTime,
          updatedAt: orderTime,
          items: { create: lineItems },
        },
      });

      totalOrdersCreated++;

      // Only COMPLETED orders consume inventory
      if (status === OrderState.COMPLETED) {
        // Aggregate ingredient consumption across all line items
        const consumptionMap: Record<string, number> = {};

        for (const li of lineItems) {
          const catalog = MENU_CATALOG.find((m) => m.item.id === li.menuItemId);
          if (!catalog) continue;
          for (const ing of catalog.ingredients) {
            consumptionMap[ing.inventoryItemId] =
              (consumptionMap[ing.inventoryItemId] ?? 0) +
              ing.qtyPerUnit * li.quantity;
          }
        }

        // Create one usage log per ingredient consumed
        for (const [invItemId, qty] of Object.entries(consumptionMap)) {
          const rounded = parseFloat(qty.toFixed(4));
          const prev = parseFloat((runningQty[invItemId] ?? 0).toFixed(4));
          const next = parseFloat(Math.max(0, prev - rounded).toFixed(4));
          runningQty[invItemId] = next;

          await prisma.inventoryUsageLog.create({
            data: {
              branchId: branch.id,
              inventoryItemId: invItemId,
              orderId: order.id,
              action: InventoryLogAction.CONSUME,
              notes: `Consumed for order #${order.orderNumber}`,
              previousQuantity: prev,
              newQuantity: next,
              quantityChange: parseFloat((-rounded).toFixed(4)),
              createdAt: orderTime,
            },
          });

          totalLogsCreated++;
        }
      }
    }

    // Progress log every 10 days
    if ((dayIndex + 1) % 10 === 0) {
      console.log(
        `  📅 Day ${dayIndex + 1}/60 done — ${totalOrdersCreated} orders so far`,
      );
    }
  }

  console.log(
    `✅ Historical orders created: ${totalOrdersCreated} orders, ${totalLogsCreated} inventory logs`,
  );

  // -------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------
  console.log(`
✅ Seeding completed successfully!

📊 Summary:
├── 1   System Admin
├── 7   Users (owner · manager · cashier · chief · waiter · 2 customers)
├── 4   Restaurants
├── 5   Branches (ACTIVE with location data & schedules)
├── 3   Hardware Devices (KDS & Printers)
├── 3   Dietary Tags
├── 3   Tables  +  3 Reservations
├── 1   Warehouse
├── 7   Ingredients  +  7 Inventory Items  +  7 Stock Batches
├── 7   Menu Items (appetizer · mains · side · dessert · beverage · 1 unavailable)
├── 12  Recipe entries
├── 4   Shifts
├── 6   Expenses
├── ~${totalOrdersCreated}  Orders spread across 60 days (realistic weekday/weekend patterns)
└── ~${totalLogsCreated}  Inventory usage logs (COMPLETED orders only, per recipe)
  `);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
