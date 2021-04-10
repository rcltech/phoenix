import * as env from "dotenv";
import { PrismaClient, Room } from "@prisma/client";

env.config();

const prisma = new PrismaClient();

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
