import * as env from "dotenv";
import {
  BatchPayloadPromise,
  prisma,
  Room,
} from "../../src/generated/prisma-client";
env.config();
export const createRoom = (room: Room): Promise<Room> => {
  return prisma.createRoom({
    name: room.name,
    number: room.number,
  });
};

export const deleteRooms = (): BatchPayloadPromise => {
  return prisma.deleteManyRooms({});
};
