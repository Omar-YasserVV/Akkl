import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
import {
  DietaryType,
  ExpenseType,
  OrderState,
  Prisma,
  PrismaClient,
  ShiftStatus,
  UserRole,
} from '../generated/client/client';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg(process.env.DATABASE_URL),
});

// ─── Helpers ────────────────────────────────────────────────────────────────

async function getOrCreateDietaryTag(name: DietaryType) {
  const existing = await prisma.dietaryTag.findFirst({ where: { name } });
  if (existing) return existing;
  return prisma.dietaryTag.create({ data: { name } });
}

function dec(value: string) {
  return new Prisma.Decimal(value);
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🚀  Starting comprehensive seed...\n');

  // ── 1. System Admin ────────────────────────────────────────────────────────
  await prisma.systemAdmin.upsert({
    where: { email: 'admin@system.com' },
    update: {},
    create: {
      email: 'admin@system.com',
      password: 'hashed_admin_password',
    },
  });
  console.log('✅  SystemAdmin created');

  // ── 2. Token Blacklist (simulate a logged-out token) ───────────────────────
  await prisma.tokenBlacklist.upsert({
    where: { token: 'expired.jwt.token.example' },
    update: {},
    create: { token: 'expired.jwt.token.example' },
  });
  console.log('✅  TokenBlacklist entry created');

  // ── 3. Users — one per role ────────────────────────────────────────────────
  const owner = await prisma.user.upsert({
    where: { email: 'owner@burgers.com' },
    update: {},
    create: {
      email: 'owner@burgers.com',
      username: 'burger_boss',
      password: 'hashed_pw',
      fullName: 'Alice Martin',
      phone: '1000000001',
      role: UserRole.BUSINESS_OWNER,
    },
  });

  const owner2 = await prisma.user.upsert({
    where: { email: 'owner2@pizzapalace.com' },
    update: {},
    create: {
      email: 'owner2@pizzapalace.com',
      username: 'pizza_boss',
      password: 'hashed_pw',
      fullName: 'Marco Rossi',
      phone: '1000000002',
      role: UserRole.BUSINESS_OWNER,
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: 'manager@burgers.com' },
    update: {},
    create: {
      email: 'manager@burgers.com',
      username: 'mgr_downtown',
      password: 'hashed_pw',
      fullName: 'Bob Chen',
      phone: '1000000003',
      role: UserRole.MANAGER,
      salary: dec('3500.00'),
    },
  });

  const chief = await prisma.user.upsert({
    where: { email: 'chief@burgers.com' },
    update: {},
    create: {
      email: 'chief@burgers.com',
      username: 'head_chef',
      password: 'hashed_pw',
      fullName: 'Sara Kovač',
      phone: '1000000004',
      role: UserRole.CHIEF,
      salary: dec('2800.00'),
    },
  });

  const waiter = await prisma.user.upsert({
    where: { email: 'waiter@burgers.com' },
    update: {},
    create: {
      email: 'waiter@burgers.com',
      username: 'waiter_tom',
      password: 'hashed_pw',
      fullName: 'Tom Nguyen',
      phone: '1000000005',
      role: UserRole.WAITER,
      salary: dec('1800.00'),
    },
  });

  const cashier = await prisma.user.upsert({
    where: { email: 'cashier@burgers.com' },
    update: {},
    create: {
      email: 'cashier@burgers.com',
      username: 'cashier_dana',
      password: 'hashed_pw',
      fullName: 'Dana Brooks',
      phone: '1000000006',
      role: UserRole.CASHIER,
      salary: dec('1600.00'),
    },
  });

  const customer1 = await prisma.user.upsert({
    where: { email: 'customer1@example.com' },
    update: {},
    create: {
      email: 'customer1@example.com',
      username: 'hungry_jane',
      password: 'hashed_pw',
      fullName: 'Jane Smith',
      phone: '1000000007',
      role: UserRole.CUSTOMER,
    },
  });

  const customer2 = await prisma.user.upsert({
    where: { email: 'customer2@example.com' },
    update: {},
    create: {
      email: 'customer2@example.com',
      username: 'foodie_alex',
      password: 'hashed_pw',
      fullName: 'Alex Johnson',
      phone: '1000000008',
      role: UserRole.CUSTOMER,
      // OTP pending state
      otpCode: '482910',
      otpExpires: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  const customer3 = await prisma.user.upsert({
    where: { email: 'customer3@example.com' },
    update: {},
    create: {
      email: 'customer3@example.com',
      username: 'vegan_victor',
      password: 'hashed_pw',
      fullName: 'Victor Lee',
      phone: '1000000009',
      role: UserRole.CUSTOMER,
    },
  });

  console.log('✅  Users created (all roles covered)');

  // ── 4. Restaurants ────────────────────────────────────────────────────────
  const burgerJoint = await prisma.restaurant.upsert({
    where: { name: 'The Burger Joint' },
    update: {},
    create: {
      name: 'The Burger Joint',
      ownerId: owner.id,
      logoUrl: 'https://cdn.example.com/burger-logo.png',
    },
  });

  const pizzaPalace = await prisma.restaurant.upsert({
    where: { name: 'Pizza Palace' },
    update: {},
    create: { name: 'Pizza Palace', ownerId: owner2.id },
  });

  console.log('✅  Restaurants created');

  // ── 5. Branches ───────────────────────────────────────────────────────────
  // Branch A — full features enabled
  const branchA = await prisma.branch.upsert({
    where: { address: '123 Main St, City Center' },
    update: {},
    create: {
      restaurantId: burgerJoint.id,
      branchNumber: 'B001',
      name: 'Downtown Branch',
      address: '123 Main St, City Center',
      haveTables: true,
      haveWarehouses: true,
      haveReservations: true,
    },
  });

  // Branch B — delivery-only (no tables, no reservations)
  const branchB = await prisma.branch.upsert({
    where: { address: '456 North Ave, Suburb' },
    update: {},
    create: {
      restaurantId: burgerJoint.id,
      branchNumber: 'B002',
      name: 'Suburb Delivery Branch',
      address: '456 North Ave, Suburb',
      haveTables: false,
      haveWarehouses: true,
      haveReservations: false,
    },
  });

  // Branch C — pizza (different restaurant)
  const branchC = await prisma.branch.upsert({
    where: { address: '789 West Blvd, Old Town' },
    update: {},
    create: {
      restaurantId: pizzaPalace.id,
      branchNumber: 'P001',
      name: 'Old Town Pizza',
      address: '789 West Blvd, Old Town',
      haveTables: true,
      haveWarehouses: true,
      haveReservations: true,
    },
  });

  console.log('✅  Branches created (3 branches, 2 restaurants)');

  // ── 6. Assign employees to branches ───────────────────────────────────────
  await prisma.user.update({
    where: { id: manager.id },
    data: { branchId: branchA.id },
  });
  await prisma.user.update({
    where: { id: chief.id },
    data: { branchId: branchA.id },
  });
  await prisma.user.update({
    where: { id: waiter.id },
    data: { branchId: branchA.id },
  });
  await prisma.user.update({
    where: { id: cashier.id },
    data: { branchId: branchA.id },
  });
  console.log('✅  Employees assigned to Branch A');

  // ── 7. Dietary Tags — all enum values ─────────────────────────────────────
  const tagVegan = await getOrCreateDietaryTag(DietaryType.VEGAN);
  const tagGlutenFree = await getOrCreateDietaryTag(DietaryType.GLUTEN_FREE);
  const tagDairyFree = await getOrCreateDietaryTag(DietaryType.DAIRY_FREE);
  console.log('✅  All DietaryTags created');

  // ── 8. Ingredients ────────────────────────────────────────────────────────
  const ingBriocheBun = await prisma.ingredient.upsert({
    where: { name: 'Brioche Bun' },
    update: {},
    create: { name: 'Brioche Bun', unit: 'piece' },
  });
  const ingVeganBun = await prisma.ingredient.upsert({
    where: { name: 'Vegan Bun' },
    update: {},
    create: { name: 'Vegan Bun', unit: 'piece' },
  });
  const ingBeefPatty = await prisma.ingredient.upsert({
    where: { name: 'Beef Patty' },
    update: {},
    create: { name: 'Beef Patty', unit: 'kg' },
  });
  const ingVeganPatty = await prisma.ingredient.upsert({
    where: { name: 'Plant-Based Patty' },
    update: {},
    create: { name: 'Plant-Based Patty', unit: 'kg' },
  });
  const ingCheese = await prisma.ingredient.upsert({
    where: { name: 'Cheddar Cheese' },
    update: {},
    create: { name: 'Cheddar Cheese', unit: 'kg' },
  });
  const ingLettuce = await prisma.ingredient.upsert({
    where: { name: 'Lettuce' },
    update: {},
    create: { name: 'Lettuce', unit: 'kg' },
  });
  const ingTomato = await prisma.ingredient.upsert({
    where: { name: 'Tomato' },
    update: {},
    create: { name: 'Tomato', unit: 'kg' },
  });
  const ingFries = await prisma.ingredient.upsert({
    where: { name: 'Frozen Fries' },
    update: {},
    create: { name: 'Frozen Fries', unit: 'kg' },
  });
  const ingCola = await prisma.ingredient.upsert({
    where: { name: 'Cola Syrup' },
    update: {},
    create: { name: 'Cola Syrup', unit: 'litre' },
  });
  const ingPizzaDough = await prisma.ingredient.upsert({
    where: { name: 'Pizza Dough' },
    update: {},
    create: { name: 'Pizza Dough', unit: 'kg' },
  });
  const ingTomatoSauce = await prisma.ingredient.upsert({
    where: { name: 'Tomato Sauce' },
    update: {},
    create: { name: 'Tomato Sauce', unit: 'litre' },
  });
  const ingMozzarella = await prisma.ingredient.upsert({
    where: { name: 'Mozzarella' },
    update: {},
    create: { name: 'Mozzarella', unit: 'kg' },
  });
  console.log('✅  Ingredients created');

  // ── 9. Warehouses & Inventory ──────────────────────────────────────────────
  // Branch A warehouse
  let warehouseA = await prisma.warehouse.findFirst({
    where: { name: 'Branch A Cold Storage', branchId: branchA.id },
  });
  if (!warehouseA) {
    warehouseA = await prisma.warehouse.create({
      data: {
        name: 'Branch A Cold Storage',
        branchId: branchA.id,
        items: {
          create: [
            { ingredientId: ingBriocheBun.id, quantity: 200 },
            { ingredientId: ingVeganBun.id, quantity: 100 },
            { ingredientId: ingBeefPatty.id, quantity: 80 },
            { ingredientId: ingVeganPatty.id, quantity: 40 },
            { ingredientId: ingCheese.id, quantity: 30 },
            { ingredientId: ingLettuce.id, quantity: 20 },
            { ingredientId: ingTomato.id, quantity: 25 },
            { ingredientId: ingFries.id, quantity: 150 },
            { ingredientId: ingCola.id, quantity: 50 },
          ],
        },
      },
    });
  }

  // Branch A — second warehouse (dry goods)
  let warehouseA2 = await prisma.warehouse.findFirst({
    where: { name: 'Branch A Dry Storage', branchId: branchA.id },
  });
  if (!warehouseA2) {
    warehouseA2 = await prisma.warehouse.create({
      data: {
        name: 'Branch A Dry Storage',
        branchId: branchA.id,
        items: {
          create: [{ ingredientId: ingFries.id, quantity: 300 }],
        },
      },
    });
  }

  // Branch B warehouse
  let warehouseB = await prisma.warehouse.findFirst({
    where: { name: 'Branch B Storage', branchId: branchB.id },
  });
  if (!warehouseB) {
    warehouseB = await prisma.warehouse.create({
      data: {
        name: 'Branch B Storage',
        branchId: branchB.id,
        items: {
          create: [
            { ingredientId: ingBriocheBun.id, quantity: 100 },
            { ingredientId: ingBeefPatty.id, quantity: 50 },
            { ingredientId: ingFries.id, quantity: 80 },
          ],
        },
      },
    });
  }

  // Branch C (pizza) warehouse
  let warehouseC = await prisma.warehouse.findFirst({
    where: { name: 'Pizza Storage', branchId: branchC.id },
  });
  if (!warehouseC) {
    warehouseC = await prisma.warehouse.create({
      data: {
        name: 'Pizza Storage',
        branchId: branchC.id,
        items: {
          create: [
            { ingredientId: ingPizzaDough.id, quantity: 60 },
            { ingredientId: ingTomatoSauce.id, quantity: 40 },
            { ingredientId: ingMozzarella.id, quantity: 30 },
            { ingredientId: ingTomato.id, quantity: 20 },
          ],
        },
      },
    });
  }

  console.log('✅  Warehouses & inventory created');

  // ── 10. Branch Menu Items ─────────────────────────────────────────────────

  // Helper: find-or-create BranchMenuItem (no @@unique on branchId+menuItemId).
  // Uses UncheckedCreateInput so scalar FKs (branchId, menuItemId) are accepted directly
  // without needing a nested `branch: { connect }` relation object.
  async function getOrCreateMenuItem(
    branchId: number,
    menuItemId: number,
    data: Prisma.BranchMenuItemUncheckedCreateInput,
  ) {
    const found = await prisma.branchMenuItem.findFirst({
      where: { branchId, menuItemId },
    });
    if (found) return found;
    return prisma.branchMenuItem.create({ data });
  }

  // --- Branch A menu ---
  const itemClassicBurger = await getOrCreateMenuItem(branchA.id, 1, {
    branchId: branchA.id,
    menuItemId: 1,
    name: 'Classic Beef Burger',
    description: 'Juicy beef patty with fresh veggies.',
    isAvailable: true,
    variations: {
      create: [
        { size: 'Single', price: dec('9.99') },
        { size: 'Double', price: dec('13.99'), discountPrice: dec('12.50') },
      ],
    },
    recipe: {
      create: [
        { ingredientId: ingBriocheBun.id, quantityRequired: 1 },
        { ingredientId: ingBeefPatty.id, quantityRequired: 0.15 },
        { ingredientId: ingLettuce.id, quantityRequired: 0.05 },
        { ingredientId: ingTomato.id, quantityRequired: 0.05 },
      ],
    },
  });

  const itemCheeseBurger = await getOrCreateMenuItem(branchA.id, 2, {
    branchId: branchA.id,
    menuItemId: 2,
    name: 'Cheeseburger',
    description: 'Classic burger with cheddar.',
    isAvailable: true,
    variations: {
      create: [
        { size: 'Regular', price: dec('11.50') },
        { size: 'Large', price: dec('14.00') },
      ],
    },
    recipe: {
      create: [
        { ingredientId: ingBriocheBun.id, quantityRequired: 1 },
        { ingredientId: ingBeefPatty.id, quantityRequired: 0.15 },
        { ingredientId: ingCheese.id, quantityRequired: 0.05 },
      ],
    },
  });

  const itemVeganBurger = await getOrCreateMenuItem(branchA.id, 3, {
    branchId: branchA.id,
    menuItemId: 3,
    name: 'Signature Vegan Burger',
    description: 'Plant-based patty, 100% vegan.',
    isAvailable: true,
    dietaryTags: { connect: [{ id: tagVegan.id }, { id: tagDairyFree.id }] },
    variations: {
      create: [
        { size: 'Regular', price: dec('10.99') },
        { size: 'Double Stack', price: dec('15.99') },
      ],
    },
    recipe: {
      create: [
        { ingredientId: ingVeganBun.id, quantityRequired: 1 },
        { ingredientId: ingVeganPatty.id, quantityRequired: 0.15 },
        { ingredientId: ingLettuce.id, quantityRequired: 0.05 },
        { ingredientId: ingTomato.id, quantityRequired: 0.05 },
      ],
    },
  });

  const itemFries = await getOrCreateMenuItem(branchA.id, 4, {
    branchId: branchA.id,
    menuItemId: 4,
    name: 'Crispy Fries',
    description: 'Golden fried potatoes.',
    isAvailable: true,
    dietaryTags: { connect: [{ id: tagVegan.id }, { id: tagGlutenFree.id }] },
    variations: {
      create: [
        { size: 'Small', price: dec('2.99') },
        { size: 'Medium', price: dec('3.99') },
        { size: 'Large', price: dec('4.99') },
      ],
    },
    recipe: {
      create: [{ ingredientId: ingFries.id, quantityRequired: 0.25 }],
    },
  });

  const itemCola = await getOrCreateMenuItem(branchA.id, 5, {
    branchId: branchA.id,
    menuItemId: 5,
    name: 'Cola',
    description: 'Refreshing cold drink.',
    isAvailable: true,
    dietaryTags: {
      connect: [
        { id: tagVegan.id },
        { id: tagGlutenFree.id },
        { id: tagDairyFree.id },
      ],
    },
    variations: {
      create: [
        { size: 'Regular', price: dec('1.99') },
        { size: 'Large', price: dec('2.99') },
      ],
    },
    recipe: {
      create: [{ ingredientId: ingCola.id, quantityRequired: 0.33 }],
    },
  });

  // Unavailable item (out of season / paused)
  const itemSeasonalBurger = await getOrCreateMenuItem(branchA.id, 6, {
    branchId: branchA.id,
    menuItemId: 6,
    name: 'Seasonal Truffle Burger',
    description: 'Limited time only.',
    isAvailable: false, // ← covers the unavailable case
    variations: {
      create: [{ size: 'Regular', price: dec('18.00') }],
    },
    recipe: {
      create: [
        { ingredientId: ingBriocheBun.id, quantityRequired: 1 },
        { ingredientId: ingBeefPatty.id, quantityRequired: 0.18 },
        { ingredientId: ingCheese.id, quantityRequired: 0.06 },
      ],
    },
  });

  // --- Branch B menu (subset) ---
  const itemBranchBBurger = await getOrCreateMenuItem(branchB.id, 1, {
    branchId: branchB.id,
    menuItemId: 1,
    name: 'Classic Beef Burger',
    description: 'Delivery-ready beef burger.',
    isAvailable: true,
    variations: {
      create: [
        { size: 'Single', price: dec('9.99') },
        { size: 'Double', price: dec('13.99') },
      ],
    },
    recipe: {
      create: [
        { ingredientId: ingBriocheBun.id, quantityRequired: 1 },
        { ingredientId: ingBeefPatty.id, quantityRequired: 0.15 },
      ],
    },
  });

  const itemBranchBFries = await getOrCreateMenuItem(branchB.id, 4, {
    branchId: branchB.id,
    menuItemId: 4,
    name: 'Crispy Fries',
    description: 'Golden fried potatoes.',
    isAvailable: true,
    variations: {
      create: [{ size: 'Large', price: dec('4.99') }],
    },
    recipe: {
      create: [{ ingredientId: ingFries.id, quantityRequired: 0.25 }],
    },
  });

  // --- Branch C menu (pizza) ---
  const itemMargherita = await getOrCreateMenuItem(branchC.id, 10, {
    branchId: branchC.id,
    menuItemId: 10,
    name: 'Margherita Pizza',
    description: 'Classic tomato and mozzarella.',
    isAvailable: true,
    dietaryTags: { connect: [{ id: tagVegan.id }] },
    variations: {
      create: [
        { size: '10"', price: dec('10.00') },
        { size: '14"', price: dec('14.00') },
      ],
    },
    recipe: {
      create: [
        { ingredientId: ingPizzaDough.id, quantityRequired: 0.3 },
        { ingredientId: ingTomatoSauce.id, quantityRequired: 0.1 },
        { ingredientId: ingMozzarella.id, quantityRequired: 0.15 },
        { ingredientId: ingTomato.id, quantityRequired: 0.1 },
      ],
    },
  });

  const itemPepperoni = await getOrCreateMenuItem(branchC.id, 11, {
    branchId: branchC.id,
    menuItemId: 11,
    name: 'Pepperoni Pizza',
    description: 'Loaded with pepperoni slices.',
    isAvailable: true,
    variations: {
      create: [
        { size: '10"', price: dec('12.00') },
        { size: '14"', price: dec('16.00'), discountPrice: dec('14.50') },
      ],
    },
    recipe: {
      create: [
        { ingredientId: ingPizzaDough.id, quantityRequired: 0.3 },
        { ingredientId: ingTomatoSauce.id, quantityRequired: 0.1 },
        { ingredientId: ingMozzarella.id, quantityRequired: 0.15 },
      ],
    },
  });

  console.log(
    '✅  Branch menu items created (available, unavailable, multi-branch)',
  );

  // ── 11. Tables ────────────────────────────────────────────────────────────
  const tableA1 = await prisma.table.upsert({
    where: {
      tableNumber_branchId: { tableNumber: 'T1', branchId: branchA.id },
    },
    update: {},
    create: { tableNumber: 'T1', capacity: 2, branchId: branchA.id },
  });
  const tableA2 = await prisma.table.upsert({
    where: {
      tableNumber_branchId: { tableNumber: 'T2', branchId: branchA.id },
    },
    update: {},
    create: { tableNumber: 'T2', capacity: 4, branchId: branchA.id },
  });
  const tableA3 = await prisma.table.upsert({
    where: {
      tableNumber_branchId: { tableNumber: 'T3', branchId: branchA.id },
    },
    update: {},
    create: { tableNumber: 'T3', capacity: 6, branchId: branchA.id },
  });
  const tableA4 = await prisma.table.upsert({
    where: {
      tableNumber_branchId: { tableNumber: 'T4', branchId: branchA.id },
    },
    update: {},
    create: { tableNumber: 'T4', capacity: 8, branchId: branchA.id },
  });

  const tableC1 = await prisma.table.upsert({
    where: {
      tableNumber_branchId: { tableNumber: 'T1', branchId: branchC.id },
    },
    update: {},
    create: { tableNumber: 'T1', capacity: 4, branchId: branchC.id },
  });
  const tableC2 = await prisma.table.upsert({
    where: {
      tableNumber_branchId: { tableNumber: 'T2', branchId: branchC.id },
    },
    update: {},
    create: { tableNumber: 'T2', capacity: 6, branchId: branchC.id },
  });

  console.log('✅  Tables created (Branch A: 4 tables, Branch C: 2 tables)');

  // ── 12. Shifts — all ShiftStatus values ───────────────────────────────────
  // ACTIVE shift
  await prisma.shift.create({
    data: {
      userId: manager.id,
      branchId: branchA.id,
      status: ShiftStatus.ACTIVE,
      startTime: new Date(),
    },
  });

  // WORKING shift
  await prisma.shift.create({
    data: {
      userId: waiter.id,
      branchId: branchA.id,
      status: ShiftStatus.WORKING,
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
  });

  // COMPLETED shifts (historical)
  await prisma.shift.create({
    data: {
      userId: chief.id,
      branchId: branchA.id,
      status: ShiftStatus.COMPLETED,
      startTime: new Date(Date.now() - 10 * 60 * 60 * 1000),
      endTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
  });
  await prisma.shift.create({
    data: {
      userId: cashier.id,
      branchId: branchA.id,
      status: ShiftStatus.COMPLETED,
      startTime: new Date(Date.now() - 26 * 60 * 60 * 1000),
      endTime: new Date(Date.now() - 18 * 60 * 60 * 1000),
    },
  });

  console.log('✅  Shifts created (ACTIVE, WORKING, COMPLETED × 2)');

  // ── 13. Reservations ──────────────────────────────────────────────────────
  // Paid reservation
  await prisma.reservation.create({
    data: {
      reservationTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      depositAmount: dec('20.00'),
      isPaid: true,
      tableId: tableA2.id,
      branchId: branchA.id,
      userId: customer1.id,
    },
  });

  // Unpaid reservation (deposit pending)
  await prisma.reservation.create({
    data: {
      reservationTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      depositAmount: dec('15.00'),
      isPaid: false,
      tableId: tableA3.id,
      branchId: branchA.id,
      userId: customer2.id,
    },
  });

  // Past reservation (historical record)
  await prisma.reservation.create({
    data: {
      reservationTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      depositAmount: dec('10.00'),
      isPaid: true,
      tableId: tableA1.id,
      branchId: branchA.id,
      userId: customer3.id,
    },
  });

  // Pizza branch reservation
  await prisma.reservation.create({
    data: {
      reservationTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      depositAmount: dec('25.00'),
      isPaid: true,
      tableId: tableC1.id,
      branchId: branchC.id,
      userId: customer1.id,
    },
  });

  console.log('✅  Reservations created (paid, unpaid, past, multi-branch)');

  // ── 14. Orders — all OrderState values ───────────────────────────────────
  // Helper
  async function createOrderIfNone(
    userId: number,
    branchId: number,
    status: OrderState,
  ) {
    const existing = await prisma.order.findFirst({
      where: { userId, branchId, status },
    });
    if (existing) return existing;
    return null;
  }

  // PENDING order
  if (
    !(await createOrderIfNone(customer1.id, branchA.id, OrderState.PENDING))
  ) {
    await prisma.order.create({
      data: {
        totalPrice: dec('13.98'),
        itemCount: 2,
        branchId: branchA.id,
        userId: customer1.id,
        status: OrderState.PENDING,
        items: {
          create: [
            { menuItemId: itemFries.id, quantity: 2, price: dec('3.99') },
            { menuItemId: itemCola.id, quantity: 1, price: dec('1.99') },
          ],
        },
      },
    });
  }

  // IN_PROGRESS order
  if (
    !(await createOrderIfNone(customer2.id, branchA.id, OrderState.IN_PROGRESS))
  ) {
    await prisma.order.create({
      data: {
        totalPrice: dec('24.98'),
        itemCount: 3,
        branchId: branchA.id,
        userId: customer2.id,
        status: OrderState.IN_PROGRESS,
        items: {
          create: [
            {
              menuItemId: itemCheeseBurger.id,
              quantity: 1,
              price: dec('11.50'),
            },
            { menuItemId: itemFries.id, quantity: 2, price: dec('3.99') },
            { menuItemId: itemCola.id, quantity: 1, price: dec('1.99') },
          ],
        },
      },
    });
  }

  // COMPLETED order — customer 1
  if (
    !(await createOrderIfNone(customer1.id, branchA.id, OrderState.COMPLETED))
  ) {
    await prisma.order.create({
      data: {
        totalPrice: dec('32.97'),
        itemCount: 3,
        branchId: branchA.id,
        userId: customer1.id,
        status: OrderState.COMPLETED,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        items: {
          create: [
            {
              menuItemId: itemClassicBurger.id,
              quantity: 1,
              price: dec('9.99'),
            },
            {
              menuItemId: itemVeganBurger.id,
              quantity: 1,
              price: dec('10.99'),
            },
            { menuItemId: itemFries.id, quantity: 3, price: dec('2.99') },
          ],
        },
      },
    });
  }

  // COMPLETED order — customer 3 (vegan)
  if (
    !(await createOrderIfNone(customer3.id, branchA.id, OrderState.COMPLETED))
  ) {
    await prisma.order.create({
      data: {
        totalPrice: dec('15.97'),
        itemCount: 2,
        branchId: branchA.id,
        userId: customer3.id,
        status: OrderState.COMPLETED,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        items: {
          create: [
            {
              menuItemId: itemVeganBurger.id,
              quantity: 1,
              price: dec('10.99'),
            },
            { menuItemId: itemFries.id, quantity: 1, price: dec('3.99') },
            { menuItemId: itemCola.id, quantity: 1, price: dec('1.99') },
          ],
        },
      },
    });
  }

  // CANCELLED order
  if (
    !(await createOrderIfNone(customer2.id, branchA.id, OrderState.CANCELLED))
  ) {
    await prisma.order.create({
      data: {
        totalPrice: dec('9.99'),
        itemCount: 1,
        branchId: branchA.id,
        userId: customer2.id,
        status: OrderState.CANCELLED,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        items: {
          create: [
            {
              menuItemId: itemClassicBurger.id,
              quantity: 1,
              price: dec('9.99'),
            },
          ],
        },
      },
    });
  }

  // Order on Branch B (delivery)
  if (
    !(await createOrderIfNone(customer1.id, branchB.id, OrderState.COMPLETED))
  ) {
    await prisma.order.create({
      data: {
        totalPrice: dec('14.98'),
        itemCount: 2,
        branchId: branchB.id,
        userId: customer1.id,
        status: OrderState.COMPLETED,
        items: {
          create: [
            {
              menuItemId: itemBranchBBurger.id,
              quantity: 1,
              price: dec('9.99'),
            },
            {
              menuItemId: itemBranchBFries.id,
              quantity: 1,
              price: dec('4.99'),
            },
          ],
        },
      },
    });
  }

  // Order on Branch C (pizza)
  if (
    !(await createOrderIfNone(customer2.id, branchC.id, OrderState.IN_PROGRESS))
  ) {
    await prisma.order.create({
      data: {
        totalPrice: dec('26.00'),
        itemCount: 2,
        branchId: branchC.id,
        userId: customer2.id,
        status: OrderState.IN_PROGRESS,
        items: {
          create: [
            { menuItemId: itemMargherita.id, quantity: 1, price: dec('10.00') },
            { menuItemId: itemPepperoni.id, quantity: 1, price: dec('16.00') },
          ],
        },
      },
    });
  }

  console.log(
    '✅  Orders created (PENDING, IN_PROGRESS, COMPLETED × 3, CANCELLED, multi-branch)',
  );

  // ── 15. Expenses — all ExpenseType values ─────────────────────────────────
  const expenseData: {
    amount: string;
    category: ExpenseType;
    description: string;
  }[] = [
    {
      amount: '2500.00',
      category: ExpenseType.RENT,
      description: 'Monthly rent — Branch A',
    },
    {
      amount: '1200.00',
      category: ExpenseType.SALARY,
      description: 'Chef salary supplement — April',
    },
    {
      amount: '350.00',
      category: ExpenseType.UTILITIES,
      description: 'Electricity bill — March',
    },
    {
      amount: '800.00',
      category: ExpenseType.INGREDIENTS,
      description: 'Weekly ingredient restock',
    },
    {
      amount: '150.00',
      category: ExpenseType.MARKETING,
      description: 'Social media ad campaign',
    },
    {
      amount: '75.00',
      category: ExpenseType.LOSSES,
      description: 'Spoiled inventory write-off',
    },
  ];

  for (const e of expenseData) {
    await prisma.expense.create({
      data: {
        amount: dec(e.amount),
        category: e.category,
        description: e.description,
        branchId: branchA.id,
      },
    });
  }

  // Expenses on Branch B and C
  await prisma.expense.create({
    data: {
      amount: dec('1800.00'),
      category: ExpenseType.RENT,
      description: 'Branch B monthly rent',
      branchId: branchB.id,
    },
  });
  await prisma.expense.create({
    data: {
      amount: dec('600.00'),
      category: ExpenseType.UTILITIES,
      description: 'Branch C utilities',
      branchId: branchC.id,
    },
  });

  console.log('✅  Expenses created (all 6 ExpenseType values, 3 branches)');

  console.log('\n🎉  Comprehensive seed complete!\n');
  console.log('   Coverage summary:');
  console.log('   • SystemAdmin, TokenBlacklist');
  console.log(
    '   • Users: BUSINESS_OWNER × 2, MANAGER, CHIEF, WAITER, CASHIER, CUSTOMER × 3',
  );
  console.log('   • Restaurants × 2, Branches × 3');
  console.log('   • DietaryTags: VEGAN, GLUTEN_FREE, DAIRY_FREE');
  console.log(
    '   • Ingredients × 12, Warehouses × 4, InventoryItems covering all ingredients',
  );
  console.log(
    '   • BranchMenuItems × 10 (available + unavailable), Variations × 17, Recipes',
  );
  console.log('   • Tables × 6 (across 2 branches)');
  console.log('   • Shifts: ACTIVE, WORKING, COMPLETED × 2');
  console.log('   • Reservations × 4 (paid, unpaid, past, multi-branch)');
  console.log(
    '   • Orders × 7 (PENDING, IN_PROGRESS × 2, COMPLETED × 3, CANCELLED)',
  );
  console.log('   • Expenses × 8 (all 6 ExpenseType values)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
