import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

import { hashPassword } from 'utils/argon2';
import {
  BatchStatus,
  category,
  DietaryType,
  ExpenseType,
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
      restaurantId: restaurant.id,
      haveTables: true,
      haveReservations: true,
      haveWarehouses: true,
    },
  });

  const branch2 = await prisma.branch.create({
    data: {
      name: 'Uptown Branch',
      branchNumber: 'BR-002',
      address: '456 Main Avenue, New Cairo',
      restaurantId: restaurant.id,
      haveTables: false,
      haveReservations: false,
      haveWarehouses: true,
    },
  });

  await prisma.user.updateMany({
    where: { id: { in: [manager.id, cashier.id, chief.id, waiter.id] } },
    data: { branchId: branch.id },
  });

  console.log('✅ Branches created');

  // -------------------------------------------------------
  // 6. DIETARY TAGS
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
  // 7. TABLES & RESERVATIONS
  // -------------------------------------------------------
  const table1 = await prisma.table.create({
    data: { tableNumber: 'T1', capacity: 4, branchId: branch.id },
  });

  const table2 = await prisma.table.create({
    data: { tableNumber: 'T2', capacity: 2, branchId: branch.id },
  });

  const table3 = await prisma.table.create({
    data: { tableNumber: 'T3', capacity: 6, branchId: branch.id },
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
  // 8. WAREHOUSES
  // -------------------------------------------------------
  const warehouse = await prisma.warehouse.create({
    data: { name: 'Main Cold Storage', branchId: branch.id },
  });

  const warehouse2 = await prisma.warehouse.create({
    data: { name: 'Uptown Dry Storage', branchId: branch2.id },
  });

  console.log('✅ Warehouses created');

  // -------------------------------------------------------
  // 9. INGREDIENTS
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
  // 10. INVENTORY ITEMS
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

  const sesameOilItem = await prisma.inventoryItem.create({
    data: {
      ingredientId: sesameOil.id,
      warehouseId: warehouse2.id,
      quantity: 0,
      minimumQuantity: 3,
      stockStatus: stockStatus.OUT_OF_STOCK,
    },
  });

  console.log('✅ Inventory items created');

  // -------------------------------------------------------
  // 11. STOCK BATCHES
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
      {
        inventoryItemId: sesameOilItem.id,
        initialQuantity: 10.0,
        remainingQuantity: 10.0,
        numberOfUnits: 2,
        unitSize: 5,
        costPerUnit: 6.5,
        receivedAt: new Date(),
        expiresAt: new Date(Date.now() + 365 * 86400000),
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
    prisma.inventoryItem.update({
      where: { id: sesameOilItem.id },
      data: { quantity: 10.0, stockStatus: stockStatus.IN_STOCK },
    }),
  ]);

  console.log('✅ Stock batches created & inventory synced');

  // -------------------------------------------------------
  // 12. MENU ITEMS
  // New required fields: category, price, discountPrice, preparationTime
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
  // 13. RECIPES
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
  // 14. ORDERS
  // orderNumber is auto-incremented — do NOT pass it manually
  // -------------------------------------------------------
  await prisma.order.create({
    data: {
      totalPrice: 27.97,
      itemCount: 3,
      branchId: branch.id,
      userId: customer.id,
      CustomerName: 'Jane Doe',
      source: source.APP,
      status: OrderState.COMPLETED,
      specialInstructions: 'No onions please',
      items: {
        create: [
          { menuItemId: burgerItem.id, quantity: 1, price: 12.99 },
          { menuItemId: friesMenuItem.id, quantity: 2, price: 4.99 },
        ],
      },
    },
  });

  await prisma.order.create({
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
          { menuItemId: chickenSandwich.id, quantity: 1, price: 11.49 },
          { menuItemId: friesMenuItem.id, quantity: 1, price: 5.99 },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      totalPrice: 9.99,
      itemCount: 1,
      branchId: branch.id,
      userId: customer.id,
      CustomerName: 'Jane Doe',
      source: source.APP,
      status: OrderState.PENDING,
      items: {
        create: [{ menuItemId: burgerItem.id, quantity: 1, price: 9.99 }],
      },
    },
  });

  await prisma.order.create({
    data: {
      totalPrice: 12.99,
      itemCount: 1,
      branchId: branch.id,
      userId: customer2.id,
      CustomerName: 'John Smith',
      source: source.STORE,
      status: OrderState.CANCELLED,
      items: {
        create: [{ menuItemId: burgerItem.id, quantity: 1, price: 12.99 }],
      },
    },
  });

  // --- Additional 20 diverse orders for seeding ---
  await prisma.order.create({
    data: {
      totalPrice: 24.97,
      itemCount: 2,
      branchId: branch.id,
      userId: customer.id,
      CustomerName: 'Jane Doe',
      source: source.APP,
      status: OrderState.COMPLETED,
      specialInstructions: '',
      items: {
        create: [
          { menuItemId: truffleBurger.id, quantity: 1, price: 17.99 },
          { menuItemId: friesMenuItem.id, quantity: 1, price: 6.99 },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      totalPrice: 13.99,
      itemCount: 1,
      branchId: branch.id,
      userId: customer2.id,
      CustomerName: 'John Smith',
      source: source.STORE,
      status: OrderState.PENDING,
      specialInstructions: 'Extra crispy fries',
      items: {
        create: [{ menuItemId: friesMenuItem.id, quantity: 2, price: 6.99 }],
      },
    },
  });

  await prisma.order.create({
    data: {
      totalPrice: 21.99,
      itemCount: 2,
      branchId: branch.id,
      userId: customer.id,
      CustomerName: 'Jane Doe',
      source: source.APP,
      status: OrderState.IN_PROGRESS,
      items: {
        create: [{ menuItemId: chickenSandwich.id, quantity: 2, price: 10.99 }],
      },
    },
  });

  await prisma.order.create({
    data: {
      totalPrice: 14.98,
      itemCount: 2,
      branchId: branch.id,
      userId: customer2.id,
      CustomerName: 'John Smith',
      source: source.APP,
      status: OrderState.COMPLETED,
      items: {
        create: [
          { menuItemId: chocolateLavaCake.id, quantity: 2, price: 7.49 },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      totalPrice: 7.49,
      itemCount: 1,
      branchId: branch.id,
      userId: customer.id,
      CustomerName: 'Jane Doe',
      source: source.STORE,
      status: OrderState.CANCELLED,
      items: {
        create: [
          { menuItemId: chocolateLavaCake.id, quantity: 1, price: 7.49 },
        ],
      },
    },
  });

  await prisma.order.create({
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
          { menuItemId: truffleBurger.id, quantity: 1, price: 17.99 },
          { menuItemId: softDrink.id, quantity: 1, price: 0.99 },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      totalPrice: 10.98,
      itemCount: 2,
      branchId: branch.id,
      userId: customer.id,
      CustomerName: 'Jane Doe',
      source: source.STORE,
      status: OrderState.IN_PROGRESS,
      items: {
        create: [{ menuItemId: onionRings.id, quantity: 2, price: 5.49 }],
      },
    },
  });

  await prisma.order.create({
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
          { menuItemId: truffleBurger.id, quantity: 1, price: 17.99 },
          { menuItemId: chickenSandwich.id, quantity: 1, price: 7.99 },
        ],
      },
    },
  });

  await prisma.order.create({
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
          { menuItemId: friesMenuItem.id, quantity: 1, price: 6.99 },
          { menuItemId: softDrink.id, quantity: 1, price: 0.99 },
          { menuItemId: onionRings.id, quantity: 1, price: 4.51 },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      totalPrice: 17.99,
      itemCount: 1,
      branchId: branch.id,
      userId: customer2.id,
      CustomerName: 'John Smith',
      source: source.STORE,
      status: OrderState.IN_PROGRESS,
      items: {
        create: [{ menuItemId: truffleBurger.id, quantity: 1, price: 17.99 }],
      },
    },
  });

  await prisma.order.create({
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
          { menuItemId: burgerItem.id, quantity: 1, price: 9.49 },
          { menuItemId: friesMenuItem.id, quantity: 2, price: 6.49 },
        ],
      },
    },
  });

  await prisma.order.create({
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
          { menuItemId: softDrink.id, quantity: 1, price: 0.99 },
          { menuItemId: chickenSandwich.id, quantity: 1, price: 11.0 },
        ],
      },
    },
  });

  await prisma.order.create({
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
          { menuItemId: burgerItem.id, quantity: 2, price: 9.99 },
          { menuItemId: friesMenuItem.id, quantity: 2, price: 6.99 },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      totalPrice: 10.98,
      itemCount: 2,
      branchId: branch.id,
      userId: customer2.id,
      CustomerName: 'John Smith',
      source: source.APP,
      status: OrderState.PENDING,
      items: {
        create: [{ menuItemId: onionRings.id, quantity: 2, price: 5.49 }],
      },
    },
  });

  await prisma.order.create({
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
          { menuItemId: truffleBurger.id, quantity: 1, price: 17.99 },
          { menuItemId: chickenSandwich.id, quantity: 1, price: 11.99 },
        ],
      },
    },
  });

  await prisma.order.create({
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
          { menuItemId: softDrink.id, quantity: 2, price: 0.99 },
          { menuItemId: onionRings.id, quantity: 1, price: 5.0 },
        ],
      },
    },
  });

  await prisma.order.create({
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
          { menuItemId: burgerItem.id, quantity: 1, price: 9.99 },
          { menuItemId: softDrink.id, quantity: 1, price: 2.99 },
        ],
      },
    },
  });

  await prisma.order.create({
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
          { menuItemId: friesMenuItem.id, quantity: 1, price: 5.49 },
          { menuItemId: chocolateLavaCake.id, quantity: 1, price: 5.49 },
        ],
      },
    },
  });

  await prisma.order.create({
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
          { menuItemId: burgerItem.id, quantity: 2, price: 9.99 },
          { menuItemId: friesMenuItem.id, quantity: 2, price: 5.99 },
        ],
      },
    },
  });

  await prisma.order.create({
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
          { menuItemId: onionRings.id, quantity: 1, price: 5.99 },
          { menuItemId: chocolateLavaCake.id, quantity: 1, price: 7.99 },
          { menuItemId: softDrink.id, quantity: 1, price: 5.99 },
        ],
      },
    },
  });

  await prisma.order.create({
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
          { menuItemId: chickenSandwich.id, quantity: 1, price: 11.99 },
          { menuItemId: onionRings.id, quantity: 1, price: 4.0 },
        ],
      },
    },
  });

  console.log('✅ Orders created');

  // -------------------------------------------------------
  // 15. INVENTORY USAGE LOGS
  // -------------------------------------------------------
  // The `consumedQuantity` field does not exist in the InventoryUsageLog model,
  // so it is removed from data objects for createMany.
  // If you have a new model field in the schema, re-add it. Otherwise,
  // this silences the type/lint error.
  await prisma.inventoryUsageLog.createMany({
    data: [
      {
        inventoryItemId: beefItem.id,
        action: InventoryLogAction.CONSUME,
        notes: 'Used for 2 double cheeseburgers',
        previousQuantity: 10,
        newQuantity: 8,
        quantityChange: -2,
        createdAt: new Date(),
      },
      {
        inventoryItemId: cheeseItem.id,
        action: InventoryLogAction.CONSUME,
        notes: 'Used for 2 double cheeseburgers',
        previousQuantity: 12,
        newQuantity: 10,
        quantityChange: -2,
        createdAt: new Date(),
      },
      {
        inventoryItemId: lettuceItem.id,
        action: InventoryLogAction.UPDATE,
        notes: 'Wilted lettuce discarded',
        previousQuantity: 5,
        newQuantity: 4,
        quantityChange: -1,
        createdAt: new Date(),
      },
      {
        inventoryItemId: friesItem.id,
        action: InventoryLogAction.CONSUME,
        notes: 'Daily fries prep',
        previousQuantity: 7,
        newQuantity: 5,
        quantityChange: -2,
        createdAt: new Date(Date.now() - 86400000),
      },
      {
        inventoryItemId: chickenItem.id,
        action: InventoryLogAction.CONSUME,
        notes: 'Used for 1 crispy chicken sandwich',
        previousQuantity: 10,
        newQuantity: 9,
        quantityChange: -1,
        createdAt: new Date(),
      },
    ],
  });

  console.log('✅ Inventory usage logs created');

  // -------------------------------------------------------
  // 16. SHIFTS
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
  // 17. EXPENSES
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
├── 2  Branches
├── 3  Dietary Tags
├── 3  Tables  +  3 Reservations
├── 2  Warehouses
├── 8  Ingredients
├── 8  Inventory Items  +  8 Stock Batches
├── 7  Menu Items  (appetizer · mains · side · dessert · beverage · 1 unavailable)
├── 13 Recipe entries
├── 4  Orders  (pending · in-progress · completed · cancelled)
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
