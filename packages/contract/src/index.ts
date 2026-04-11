// src/index.ts
import { authContract } from './contracts/auth/index'; // The main auth ops
import { branchContract } from './contracts/branch/index'; // The main branch ops
import { menuContract } from './contracts/branch/menu';
import { orderContract } from './contracts/branch/order';
import { restaurantContract } from './contracts/restaurant/index'; // The main restaurant ops

export const contract = {
  auth: authContract,
  restaurant: restaurantContract,
  branch: branchContract,
  menu: menuContract,
  order: orderContract,
};

export type AppContract = typeof contract;