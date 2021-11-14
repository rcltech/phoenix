import { PrismaClient } from "@prisma/client";
import { prisma } from "../../src/utils/prisma";

export const setupPrismaForTesting = (): PrismaClient => {
  // eslint-disable-next-line jest/no-done-callback
  afterAll(async (done) => {
    await prisma.$disconnect();
    done();
  });

  return prisma;
};
