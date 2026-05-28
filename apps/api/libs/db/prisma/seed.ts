import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

import { hashPassword } from 'utils/argon2';
import {
  BatchStatus,
  BranchStatus,
  category,
  DietaryType,
  ExpenseType,
  HardwareType,
  IngredientCategory,
  InventoryLogAction,
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

  // -------------------------------------------------------
  // 1. CLEANUP — children before parents to respect FK constraints
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
  await prisma.hardware.deleteMany({}); // NEW: Added hardware cleanup
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
  // Utility: hash passwords using bcrypt

  // Default plaintext passwords for seed users (also written in comment for each user below)
  const passwords = {
    owner: 'owner123', // password: owner123
    manager: 'manager123', // password: manager123
    cashier: 'cashier123', // password: cashier123
    chief: 'chief123', // password: chief123
    waiter: 'waiter123', // password: waiter123
    customer: 'customer123', // password: customer123
    customer2: 'customer2123', // password: customer2123
  };

  // Hash all passwords in parallel and assign to variables
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
      password: ownerHashed, // password: owner123
      fullName: 'Omar Yasser Shawky',
      phone: '01000000001',
      role: UserRole.BUSINESS_OWNER,
    },
  });

  const manager = await prisma.user.create({
    data: {
      email: 'manager@branch.com',
      username: 'branch_mgr',
      password: managerHashed, // password: manager123
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
      password: cashierHashed, // password: cashier123
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
      password: chiefHashed, // password: chief123
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
      password: waiterHashed, // password: waiter123
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
      password: customerHashed, // password: customer123
      fullName: 'Jane Doe',
      phone: '01000000003',
      role: UserRole.CUSTOMER,
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      email: 'customer2@gmail.com',
      username: 'hungry_john',
      password: customer2Hashed, // password: customer2123
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
  // 5. BRANCHES
  // -------------------------------------------------------
  const branch = await prisma.branch.create({
    data: {
      name: 'Downtown Branch',
      branchNumber: 'BR-001',
      address: '123 Tech Street, 10th of Ramadan City',
      phone: '01555123456',
      latitude: 30.3082,
      longitude: 31.7428,
      status: BranchStatus.ACTIVE, // Force active for seed data
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

  console.log('✅ Branches created');

  // -------------------------------------------------------
  // 6. HARDWARE (NEW: Step 4 Configurations)
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
  // 8. TABLES & RESERVATIONS (UPDATED WITH ZONES)
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
  // 9. WAREHOUSES
  // -------------------------------------------------------
  const warehouse = await prisma.warehouse.create({
    data: { name: 'Main Cold Storage', branchId: branch.id },
  });

  console.log('✅ Warehouses created');

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

  const sesameOil = await prisma.ingredient.upsert({
    where: { name: 'Sesame Oil' },
    update: {},
    create: {
      name: 'Sesame Oil',
      unit: MeasurementUnit.L,
      category: IngredientCategory.OILS,
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

  const chickenItem = await prisma.inventoryItem.create({
    data: {
      ingredientId: chickenBreast.id,
      warehouseId: warehouse.id,
      quantity: 0,
      minimumQuantity: 15,
      stockStatus: stockStatus.OUT_OF_STOCK,
    },
  });

  const lettuceItem = await prisma.inventoryItem.create({
    data: {
      ingredientId: lettuce.id,
      warehouseId: warehouse.id,
      quantity: 0,
      minimumQuantity: 5,
      stockStatus: stockStatus.OUT_OF_STOCK,
    },
  });

  const oilItem = await prisma.inventoryItem.create({
    data: {
      ingredientId: oliveOil.id,
      warehouseId: warehouse.id,
      quantity: 0,
      minimumQuantity: 5,
      stockStatus: stockStatus.OUT_OF_STOCK,
    },
  });

  const friesItem = await prisma.inventoryItem.create({
    data: {
      ingredientId: frenchFries.id,
      warehouseId: warehouse.id,
      quantity: 0,
      minimumQuantity: 20,
      stockStatus: stockStatus.OUT_OF_STOCK,
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
        initialQuantity: 150.5,
        remainingQuantity: 150.5,
        numberOfUnits: 15,
        unitSize: 10,
        costPerUnit: 9.0,
        receivedAt: new Date(),
        expiresAt: new Date(Date.now() + 5 * 86400000),
        status: BatchStatus.ACTIVE,
      },
      {
        inventoryItemId: cheeseItem.id,
        initialQuantity: 60.0,
        remainingQuantity: 60.0,
        numberOfUnits: 12,
        unitSize: 5,
        costPerUnit: 13.0,
        receivedAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 86400000),
        status: BatchStatus.ACTIVE,
      },
      {
        inventoryItemId: bunItem.id,
        initialQuantity: 200,
        remainingQuantity: 200,
        numberOfUnits: 10,
        unitSize: 20,
        costPerUnit: 0.3,
        receivedAt: new Date(),
        expiresAt: new Date(Date.now() + 3 * 86400000),
        status: BatchStatus.ACTIVE,
      },
      {
        inventoryItemId: chickenItem.id,
        initialQuantity: 80.0,
        remainingQuantity: 80.0,
        numberOfUnits: 8,
        unitSize: 10,
        costPerUnit: 7.5,
        receivedAt: new Date(),
        expiresAt: new Date(Date.now() + 4 * 86400000),
        status: BatchStatus.ACTIVE,
      },
      {
        inventoryItemId: lettuceItem.id,
        initialQuantity: 25.0,
        remainingQuantity: 25.0,
        numberOfUnits: 5,
        unitSize: 5,
        costPerUnit: 1.2,
        receivedAt: new Date(),
        expiresAt: new Date(Date.now() + 2 * 86400000),
        status: BatchStatus.ACTIVE,
      },
      {
        inventoryItemId: oilItem.id,
        initialQuantity: 20.0,
        remainingQuantity: 20.0,
        numberOfUnits: 4,
        unitSize: 5,
        costPerUnit: 8.0,
        receivedAt: new Date(),
        expiresAt: new Date(Date.now() + 180 * 86400000),
        status: BatchStatus.ACTIVE,
      },
      {
        inventoryItemId: friesItem.id,
        initialQuantity: 100.0,
        remainingQuantity: 5.0,
        numberOfUnits: 10,
        unitSize: 10,
        costPerUnit: 2.5,
        receivedAt: new Date(Date.now() - 10 * 86400000),
        expiresAt: new Date(Date.now() + 20 * 86400000),
        status: BatchStatus.ACTIVE,
      },
    ],
  });

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
    prisma.inventoryItem.update({
      where: { id: chickenItem.id },
      data: { quantity: 80.0, stockStatus: stockStatus.IN_STOCK },
    }),
    prisma.inventoryItem.update({
      where: { id: lettuceItem.id },
      data: { quantity: 25.0, stockStatus: stockStatus.IN_STOCK },
    }),
    prisma.inventoryItem.update({
      where: { id: oilItem.id },
      data: { quantity: 20.0, stockStatus: stockStatus.IN_STOCK },
    }),
    prisma.inventoryItem.update({
      where: { id: friesItem.id },
      data: { quantity: 5.0, stockStatus: stockStatus.LOW_STOCK },
    }),
  ]);

  console.log('✅ Stock batches created & inventory synced');

  // -------------------------------------------------------
  // 13. MENU ITEMS
  // -------------------------------------------------------
  const burgerItem = await prisma.branchMenuItem.create({
    data: {
      branchId: branch.id,
      menuItemId: 'menu001',
      name: 'Double Cheeseburger',
      description: 'Signature beef burger with double cheddar cheese',
      category: category.MAIN_COURSE,
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

  const chocolateLavaCake = await prisma.branchMenuItem.create({
    data: {
      branchId: branch.id,
      menuItemId: 'menu005',
      name: 'Chocolate Lava Cake',
      description: 'Warm chocolate cake with molten chocolate center',
      category: category.DESSERT,
      price: 6.99,
      discountPrice: 5.99,
      preparationTime: 8,
      isAvailable: true,
      variations: {
        create: [
          { size: 'Single', price: 6.99, discountPrice: 5.99 },
          { size: 'Double', price: 12.99 },
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
      category: category.MAIN_COURSE,
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
      category: category.SIDE_DISH,
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
      category: category.MAIN_COURSE,
      price: 24.99,
      preparationTime: 18,
      isAvailable: false,
      variations: {
        create: [{ size: 'One Size', price: 24.99 }],
      },
    },
  });

  const chocLava = await prisma.branchMenuItem.create({
    data: {
      branchId: branch.id,
      menuItemId: 'menu005',
      name: 'Chocolate Lava Cake',
      description: 'Warm chocolate cake with a molten centre',
      category: category.DESSERT,
      price: 6.99,
      preparationTime: 15,
      isAvailable: true,
    },
  });

  const softDrink = await prisma.branchMenuItem.create({
    data: {
      branchId: branch.id,
      menuItemId: 'menu006',
      name: 'Soft Drink',
      description: 'Chilled can of your choice',
      category: category.BEVERAGE,
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
      category: category.APPETIZER,
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
      // Double Cheeseburger
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
      // Crispy Chicken Sandwich
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
      // Seasoned Fries
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
      // Truffle Burger
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
      // Onion Rings
      {
        menuItemId: onionRings.id,
        ingredientId: oliveOil.id,
        quantityRequired: 0.03,
      },
      // Chocolate Lava Cake & Soft Drink have no tracked ingredients
    ],
  });

  // Silence unused-variable lint for items with no recipe entries
  void chocLava;
  void softDrink;

  console.log('✅ Recipes created');

  // -------------------------------------------------------
  // 15. ORDERS
  // -------------------------------------------------------
  const orderLine = (menuItemId: string, quantity: number, price: number) => ({
    menuItemId,
    quantity,
    price,
    totalPrice: quantity * price,
  });

  // Use captures to store created order objects for possible further use
  const order1 = await prisma.order.create({
    data: {
      totalPrice: 27.97,
      itemCount: 3,
      branchId: branch.id,
      userId: customer.id,
      CustomerName: 'Jane Doe',
      source: source.APP,
      status: OrderState.COMPLETED,
      items: {
        create: [
          orderLine(burgerItem.id, 1, 12.99),
          orderLine(friesMenuItem.id, 2, 4.99),
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      totalPrice: 19.98,
      itemCount: 2,
      branchId: branch.id,
      userId: customer2.id,
      CustomerName: 'John Smith',
      source: source.STORE,
      status: OrderState.IN_PROGRESS,
      items: {
        create: [
          orderLine(chickenSandwich.id, 1, 11.49),
          orderLine(friesMenuItem.id, 1, 5.99),
        ],
      },
    },
  });

  const order3 = await prisma.order.create({
    data: {
      totalPrice: 9.99,
      itemCount: 1,
      branchId: branch.id,
      userId: customer.id,
      CustomerName: 'Jane Doe',
      source: source.APP,
      status: OrderState.PENDING,
      items: {
        create: [orderLine(burgerItem.id, 1, 9.99)],
      },
    },
  });

  const order4 = await prisma.order.create({
    data: {
      totalPrice: 12.99,
      itemCount: 1,
      branchId: branch.id,
      userId: customer2.id,
      CustomerName: 'John Smith',
      source: source.STORE,
      status: OrderState.CANCELLED,
      items: {
        create: [orderLine(burgerItem.id, 1, 12.99)],
      },
    },
  });

  // --- Additional 20 diverse orders for seeding ---
  const order5 = await prisma.order.create({
    data: {
      totalPrice: 24.97,
      itemCount: 2,
      branchId: branch.id,
      userId: customer.id,
      CustomerName: 'Jane Doe',
      source: source.APP,
      status: OrderState.COMPLETED,
      items: {
        create: [
          orderLine(truffleBurger.id, 1, 17.99),
          orderLine(friesMenuItem.id, 1, 6.99),
        ],
      },
    },
  });

  const order6 = await prisma.order.create({
    data: {
      totalPrice: 13.99,
      itemCount: 1,
      branchId: branch.id,
      userId: customer2.id,
      CustomerName: 'John Smith',
      source: source.STORE,
      status: OrderState.PENDING,
      items: {
        create: [orderLine(friesMenuItem.id, 2, 6.99)],
      },
    },
  });

  const order7 = await prisma.order.create({
    data: {
      totalPrice: 21.99,
      itemCount: 2,
      branchId: branch.id,
      userId: customer.id,
      CustomerName: 'Jane Doe',
      source: source.APP,
      status: OrderState.IN_PROGRESS,
      items: {
        create: [orderLine(chickenSandwich.id, 2, 10.99)],
      },
    },
  });

  const order8 = await prisma.order.create({
    data: {
      totalPrice: 14.98,
      itemCount: 2,
      branchId: branch.id,
      userId: customer2.id,
      CustomerName: 'John Smith',
      source: source.APP,
      status: OrderState.COMPLETED,
      items: {
        create: [orderLine(chocolateLavaCake.id, 2, 7.49)],
      },
    },
  });

  const order9 = await prisma.order.create({
    data: {
      totalPrice: 7.49,
      itemCount: 1,
      branchId: branch.id,
      userId: customer.id,
      CustomerName: 'Jane Doe',
      source: source.STORE,
      status: OrderState.CANCELLED,
      items: {
        create: [orderLine(chocolateLavaCake.id, 1, 7.49)],
      },
    },
  });

  const order10 = await prisma.order.create({
    data: {
      totalPrice: 18.98,
      itemCount: 2,
      branchId: branch.id,
      userId: customer2.id,
      CustomerName: 'John Smith',
      source: source.APP,
      status: OrderState.COMPLETED,
      items: {
        create: [
          orderLine(truffleBurger.id, 1, 17.99),
          orderLine(softDrink.id, 1, 0.99),
        ],
      },
    },
  });

  const order11 = await prisma.order.create({
    data: {
      totalPrice: 10.98,
      itemCount: 2,
      branchId: branch.id,
      userId: customer.id,
      CustomerName: 'Jane Doe',
      source: source.STORE,
      status: OrderState.IN_PROGRESS,
      items: {
        create: [orderLine(onionRings.id, 2, 5.49)],
      },
    },
  });

  const order12 = await prisma.order.create({
    data: {
      totalPrice: 25.98,
      itemCount: 2,
      branchId: branch.id,
      userId: customer2.id,
      CustomerName: 'John Smith',
      source: source.APP,
      status: OrderState.COMPLETED,
      items: {
        create: [
          orderLine(truffleBurger.id, 1, 17.99),
          orderLine(chickenSandwich.id, 1, 7.99),
        ],
      },
    },
  });

  const order13 = await prisma.order.create({
    data: {
      totalPrice: 12.49,
      itemCount: 1,
      branchId: branch.id,
      userId: customer.id,
      CustomerName: 'Jane Doe',
      source: source.APP,
      status: OrderState.PENDING,
      items: {
        create: [
          orderLine(friesMenuItem.id, 1, 6.99),
          orderLine(softDrink.id, 1, 0.99),
          orderLine(onionRings.id, 1, 4.51),
        ],
      },
    },
  });

  const order14 = await prisma.order.create({
    data: {
      totalPrice: 17.99,
      itemCount: 1,
      branchId: branch.id,
      userId: customer2.id,
      CustomerName: 'John Smith',
      source: source.STORE,
      status: OrderState.IN_PROGRESS,
      items: {
        create: [orderLine(truffleBurger.id, 1, 17.99)],
      },
    },
  });

  const order15 = await prisma.order.create({
    data: {
      totalPrice: 22.48,
      itemCount: 3,
      branchId: branch.id,
      userId: customer.id,
      CustomerName: 'Jane Doe',
      source: source.APP,
      status: OrderState.COMPLETED,
      items: {
        create: [
          orderLine(burgerItem.id, 1, 9.49),
          orderLine(friesMenuItem.id, 2, 6.49),
        ],
      },
    },
  });

  const order16 = await prisma.order.create({
    data: {
      totalPrice: 11.99,
      itemCount: 2,
      branchId: branch.id,
      userId: customer2.id,
      CustomerName: 'John Smith',
      source: source.STORE,
      status: OrderState.CANCELLED,
      items: {
        create: [
          orderLine(softDrink.id, 1, 0.99),
          orderLine(chickenSandwich.id, 1, 11.0),
        ],
      },
    },
  });

  const order17 = await prisma.order.create({
    data: {
      totalPrice: 36.97,
      itemCount: 3,
      branchId: branch.id,
      userId: customer.id,
      CustomerName: 'Jane Doe',
      source: source.APP,
      status: OrderState.COMPLETED,
      items: {
        create: [
          orderLine(burgerItem.id, 2, 9.99),
          orderLine(friesMenuItem.id, 2, 6.99),
        ],
      },
    },
  });

  const order18 = await prisma.order.create({
    data: {
      totalPrice: 10.98,
      itemCount: 2,
      branchId: branch.id,
      userId: customer2.id,
      CustomerName: 'John Smith',
      source: source.APP,
      status: OrderState.PENDING,
      items: {
        create: [orderLine(onionRings.id, 2, 5.49)],
      },
    },
  });

  const order19 = await prisma.order.create({
    data: {
      totalPrice: 29.98,
      itemCount: 2,
      branchId: branch.id,
      userId: customer.id,
      CustomerName: 'Jane Doe',
      source: source.STORE,
      status: OrderState.IN_PROGRESS,
      items: {
        create: [
          orderLine(truffleBurger.id, 1, 17.99),
          orderLine(chickenSandwich.id, 1, 11.99),
        ],
      },
    },
  });

  const order20 = await prisma.order.create({
    data: {
      totalPrice: 7.98,
      itemCount: 2,
      branchId: branch.id,
      userId: customer2.id,
      CustomerName: 'John Smith',
      source: source.STORE,
      status: OrderState.COMPLETED,
      items: {
        create: [
          orderLine(softDrink.id, 2, 0.99),
          orderLine(onionRings.id, 1, 5.0),
        ],
      },
    },
  });

  const order21 = await prisma.order.create({
    data: {
      totalPrice: 12.98,
      itemCount: 2,
      branchId: branch.id,
      userId: customer.id,
      CustomerName: 'Jane Doe',
      source: source.APP,
      status: OrderState.COMPLETED,
      items: {
        create: [
          orderLine(burgerItem.id, 1, 9.99),
          orderLine(softDrink.id, 1, 2.99),
        ],
      },
    },
  });

  const order22 = await prisma.order.create({
    data: {
      totalPrice: 10.98,
      itemCount: 2,
      branchId: branch.id,
      userId: customer2.id,
      CustomerName: 'John Smith',
      source: source.STORE,
      status: OrderState.CANCELLED,
      items: {
        create: [
          orderLine(friesMenuItem.id, 1, 5.49),
          orderLine(chocolateLavaCake.id, 1, 5.49),
        ],
      },
    },
  });

  const order23 = await prisma.order.create({
    data: {
      totalPrice: 31.98,
      itemCount: 4,
      branchId: branch.id,
      userId: customer.id,
      CustomerName: 'Jane Doe',
      source: source.APP,
      status: OrderState.IN_PROGRESS,
      items: {
        create: [
          orderLine(burgerItem.id, 2, 9.99),
          orderLine(friesMenuItem.id, 2, 5.99),
        ],
      },
    },
  });

  const order24 = await prisma.order.create({
    data: {
      totalPrice: 19.97,
      itemCount: 3,
      branchId: branch.id,
      userId: customer2.id,
      CustomerName: 'John Smith',
      source: source.STORE,
      status: OrderState.COMPLETED,
      items: {
        create: [
          orderLine(onionRings.id, 1, 5.99),
          orderLine(chocolateLavaCake.id, 1, 7.99),
          orderLine(softDrink.id, 1, 5.99),
        ],
      },
    },
  });

  const order25 = await prisma.order.create({
    data: {
      totalPrice: 15.99,
      itemCount: 2,
      branchId: branch.id,
      userId: customer.id,
      CustomerName: 'Jane Doe',
      source: source.APP,
      status: OrderState.COMPLETED,
      items: {
        create: [
          orderLine(chickenSandwich.id, 1, 11.99),
          orderLine(onionRings.id, 1, 4.0),
        ],
      },
    },
  });

  console.log('✅ Orders created');

  // -------------------------------------------------------
  // 16. INVENTORY USAGE LOGS
  // -------------------------------------------------------
  // Inventory Usage Logs referencing seeded orders

  // Create one inventory usage log per order (matching all 25 orders)
  await prisma.inventoryUsageLog.createMany({
    data: [
      // Manually written example logs for demonstration; adjust the inventoryItemId, notes, and values accordingly.
      {
        branchId: branch.id,
        inventoryItemId: beefItem.id,
        orderId: order1.id,
        action: InventoryLogAction.CONSUME,
        notes: 'Used for 2 double cheeseburgers (order1)',
        previousQuantity: 10,
        newQuantity: 8,
        quantityChange: -2,
        createdAt: new Date(order1.createdAt ?? Date.now()),
      },
      {
        branchId: branch.id,
        inventoryItemId: cheeseItem.id,
        orderId: order2.id,
        action: InventoryLogAction.CONSUME,
        notes: 'Used cheese in crispy chicken sandwich (order2)',
        previousQuantity: 20,
        newQuantity: 19,
        quantityChange: -1,
        createdAt: new Date(order2.createdAt ?? Date.now()),
      },
      {
        branchId: branch.id,
        inventoryItemId: friesItem.id,
        orderId: order3.id,
        action: InventoryLogAction.CONSUME,
        notes: 'Used for fries order (order3)',
        previousQuantity: 30,
        newQuantity: 28,
        quantityChange: -2,
        createdAt: new Date(order3.createdAt ?? Date.now()),
      },
      {
        branchId: branch.id,
        inventoryItemId: lettuceItem.id,
        orderId: order4.id,
        action: InventoryLogAction.CONSUME,
        notes: 'Lettuce for veggie burger (order4)',
        previousQuantity: 10,
        newQuantity: 9,
        quantityChange: -1,
        createdAt: new Date(order4.createdAt ?? Date.now()),
      },
      {
        branchId: branch.id,
        inventoryItemId: chickenItem.id,
        orderId: order5.id,
        action: InventoryLogAction.CONSUME,
        notes: 'Chicken used in sandwich (order5)',
        previousQuantity: 8,
        newQuantity: 7,
        quantityChange: -1,
        createdAt: new Date(order5.createdAt ?? Date.now()),
      },
      {
        branchId: branch.id,
        inventoryItemId: friesItem.id,
        orderId: order6.id,
        action: InventoryLogAction.CONSUME,
        notes: 'Daily fries prep (order6)',
        previousQuantity: 7,
        newQuantity: 5,
        quantityChange: -2,
        createdAt: new Date(order6.createdAt ?? Date.now() - 86400000),
      },
      {
        branchId: branch.id,
        inventoryItemId: beefItem.id,
        orderId: order7.id,
        action: InventoryLogAction.CONSUME,
        notes: 'Used for beef burger (order7)',
        previousQuantity: 8,
        newQuantity: 7,
        quantityChange: -1,
        createdAt: new Date(order7.createdAt ?? Date.now()),
      },
      {
        branchId: branch.id,
        inventoryItemId: cheeseItem.id,
        orderId: order8.id,
        action: InventoryLogAction.CONSUME,
        notes: 'Cheese slice for cheeseburger (order8)',
        previousQuantity: 19,
        newQuantity: 18,
        quantityChange: -1,
        createdAt: new Date(order8.createdAt ?? Date.now()),
      },
      {
        branchId: branch.id,
        inventoryItemId: lettuceItem.id,
        orderId: order9.id,
        action: InventoryLogAction.CONSUME,
        notes: 'Lettuce in taco (order9)',
        previousQuantity: 9,
        newQuantity: 8,
        quantityChange: -1,
        createdAt: new Date(order9.createdAt ?? Date.now()),
      },
      {
        branchId: branch.id,
        inventoryItemId: chickenItem.id,
        orderId: order10.id,
        action: InventoryLogAction.CONSUME,
        notes: 'Chicken for wrap (order10)',
        previousQuantity: 7,
        newQuantity: 5,
        quantityChange: -2,
        createdAt: new Date(order10.createdAt ?? Date.now()),
      },
      {
        branchId: branch.id,
        inventoryItemId: beefItem.id,
        orderId: order11.id,
        action: InventoryLogAction.CONSUME,
        notes: 'Beef for nachos (order11)',
        previousQuantity: 7,
        newQuantity: 6,
        quantityChange: -1,
        createdAt: new Date(order11.createdAt ?? Date.now()),
      },
      {
        branchId: branch.id,
        inventoryItemId: cheeseItem.id,
        orderId: order12.id,
        action: InventoryLogAction.CONSUME,
        notes: 'Melted cheese on fries (order12)',
        previousQuantity: 18,
        newQuantity: 16,
        quantityChange: -2,
        createdAt: new Date(order12.createdAt ?? Date.now()),
      },
      {
        branchId: branch.id,
        inventoryItemId: lettuceItem.id,
        orderId: order13.id,
        action: InventoryLogAction.UPDATE,
        notes: 'Wilted lettuce discarded (order13)',
        previousQuantity: 5,
        newQuantity: 4,
        quantityChange: -1,
        createdAt: new Date(order13.createdAt ?? Date.now()),
      },
      {
        branchId: branch.id,
        inventoryItemId: friesItem.id,
        orderId: order14.id,
        action: InventoryLogAction.CONSUME,
        notes: 'Loaded fries special (order14)',
        previousQuantity: 5,
        newQuantity: 4,
        quantityChange: -1,
        createdAt: new Date(order14.createdAt ?? Date.now()),
      },
      {
        branchId: branch.id,
        inventoryItemId: chickenItem.id,
        orderId: order15.id,
        action: InventoryLogAction.CONSUME,
        notes: 'Chicken for burrito (order15)',
        previousQuantity: 5,
        newQuantity: 4,
        quantityChange: -1,
        createdAt: new Date(order15.createdAt ?? Date.now()),
      },
      {
        branchId: branch.id,
        inventoryItemId: beefItem.id,
        orderId: order16.id,
        action: InventoryLogAction.CONSUME,
        notes: 'Used for signature burger (order16)',
        previousQuantity: 6,
        newQuantity: 4,
        quantityChange: -2,
        createdAt: new Date(order16.createdAt ?? Date.now()),
      },
      {
        branchId: branch.id,
        inventoryItemId: cheeseItem.id,
        orderId: order17.id,
        action: InventoryLogAction.CONSUME,
        notes: 'Extra cheese pizza (order17)',
        previousQuantity: 16,
        newQuantity: 15,
        quantityChange: -1,
        createdAt: new Date(order17.createdAt ?? Date.now()),
      },
      {
        branchId: branch.id,
        inventoryItemId: lettuceItem.id,
        orderId: order18.id,
        action: InventoryLogAction.CONSUME,
        notes: 'Lettuce for salad (order18)',
        previousQuantity: 4,
        newQuantity: 2,
        quantityChange: -2,
        createdAt: new Date(order18.createdAt ?? Date.now()),
      },
      {
        branchId: branch.id,
        inventoryItemId: friesItem.id,
        orderId: order19.id,
        action: InventoryLogAction.CONSUME,
        notes: 'Fries consumed (order19)',
        previousQuantity: 4,
        newQuantity: 2,
        quantityChange: -2,
        createdAt: new Date(order19.createdAt ?? Date.now()),
      },
      {
        branchId: branch.id,
        inventoryItemId: chickenItem.id,
        orderId: order20.id,
        action: InventoryLogAction.CONSUME,
        notes: 'Chicken for nuggets (order20)',
        previousQuantity: 4,
        newQuantity: 3,
        quantityChange: -1,
        createdAt: new Date(order20.createdAt ?? Date.now()),
      },
      {
        branchId: branch.id,
        inventoryItemId: beefItem.id,
        orderId: order21.id,
        action: InventoryLogAction.CONSUME,
        notes: 'Beef for sliders (order21)',
        previousQuantity: 4,
        newQuantity: 2,
        quantityChange: -2,
        createdAt: new Date(order21.createdAt ?? Date.now()),
      },
      {
        branchId: branch.id,
        inventoryItemId: cheeseItem.id,
        orderId: order22.id,
        action: InventoryLogAction.CONSUME,
        notes: 'Cheese for quesadilla (order22)',
        previousQuantity: 15,
        newQuantity: 13,
        quantityChange: -2,
        createdAt: new Date(order22.createdAt ?? Date.now()),
      },
      {
        branchId: branch.id,
        inventoryItemId: lettuceItem.id,
        orderId: order23.id,
        action: InventoryLogAction.CONSUME,
        notes: 'Lettuce for wrap (order23)',
        previousQuantity: 2,
        newQuantity: 1,
        quantityChange: -1,
        createdAt: new Date(order23.createdAt ?? Date.now()),
      },
      {
        branchId: branch.id,
        inventoryItemId: friesItem.id,
        orderId: order24.id,
        action: InventoryLogAction.CONSUME,
        notes: 'Fries for large combo (order24)',
        previousQuantity: 2,
        newQuantity: 0,
        quantityChange: -2,
        createdAt: new Date(order24.createdAt ?? Date.now()),
      },
      {
        branchId: branch.id,
        inventoryItemId: chickenItem.id,
        orderId: order25.id,
        action: InventoryLogAction.CONSUME,
        notes: 'Chicken in club sandwich (order25)',
        previousQuantity: 3,
        newQuantity: 2,
        quantityChange: -1,
        createdAt: new Date(order25.createdAt ?? Date.now()),
      },
    ],
  });

  console.log('✅ Inventory usage logs created');

  // -------------------------------------------------------
  // 17. SHIFTS
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
  // 18. EXPENSES
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

  console.log(`
✅ Seeding completed successfully!

📊 Summary:
├── 1  System Admin
├── 7  Users  (owner · manager · cashier · chief · waiter · 2 customers)
├── 1  Restaurant
├── 2  Branches (ACTIVE with Location Data & Schedules)
├── 4  Hardware Devices (KDS & Printers)
├── 3  Dietary Tags
├── 3  Tables  +  3 Reservations
├── 2  Warehouses
├── 8  Ingredients
├── 8  Inventory Items  +  8 Stock Batches
├── 7  Menu Items  (appetizer · mains · side · dessert · beverage · 1 unavailable)
├── 13 Recipe entries
├── 24 Orders  (pending · in-progress · completed · cancelled)
├── 5  Inventory Usage Logs
├── 4  Shifts
└── 6  Expenses
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
