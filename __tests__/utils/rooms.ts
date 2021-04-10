import * as env from "dotenv";
import { Room } from "@prisma/client";
import { setupPrismaForTesting } from "./setupPrismaForTesting";

env.config();

const prisma = setupPrismaForTesting();

export type TestRoomInfo = {
  number: string;
  name: string;
};

export const createRoom = (room: TestRoomInfo): Promise<Room> => {
  return prisma.room.create({
    data: {
      name: room.name,
      number: room.number,
    },
  });
};

export const deleteRooms = async (): Promise<void> => {
  await prisma.room.deleteMany({});
};

export const deleteRoom = (room: Room): Promise<Room> => {
  return prisma.room.delete({
    where: {
      number: room.number,
    },
  });
};
