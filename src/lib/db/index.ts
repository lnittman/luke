import { prisma } from './prisma';

// Export the Prisma client instance
export const db = prisma;

// Re-export PrismaClient type
export type { PrismaClient } from '@prisma/client'; 