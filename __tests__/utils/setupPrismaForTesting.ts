import { PrismaClient } from "@prisma/client";
import { prisma } from "../../src/utils/prisma";

export const setupPrismaForTesting = (): PrismaClient => {
  afterAll(async done => {
    await prisma.$disconnect();
    done();
  });

  return prisma;
};
