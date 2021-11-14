import { PrismaClient } from "@prisma/client";
import { prisma } from "../../src/utils/prisma";

export const setupPrismaForTesting = (): PrismaClient => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  return prisma;
};
