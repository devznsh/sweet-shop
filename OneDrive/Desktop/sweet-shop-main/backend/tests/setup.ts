import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

beforeAll(async () => {
  // Connect to database
  await prisma.$connect();
});

afterAll(async () => {
  // Cleanup and disconnect
  await prisma.user.deleteMany();
  await prisma.sweet.deleteMany();
  await prisma.$disconnect();
});

afterEach(async () => {
  // Clean up after each test
  await prisma.user.deleteMany();
  await prisma.sweet.deleteMany();
});
