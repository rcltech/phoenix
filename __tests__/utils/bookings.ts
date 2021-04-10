import * as env from "dotenv";
import { Booking } from "@prisma/client";
import { setupPrismaForTesting } from "./setupPrismaForTesting";

const prisma = setupPrismaForTesting();

env.config();

export interface TestBookingInfo {
  user: string;
  start: Date;
  end: Date;
  room: string;
  remark: string | undefined;
}

export const createBooking = (
  testBookingInfo: TestBookingInfo
): Promise<Booking> => {
  return prisma.booking.create({
    data: {
      start: testBookingInfo.start,
      end: testBookingInfo.end,
      room: {
        connect: {
          number: testBookingInfo.room,
        },
      },
      user: {
        connect: {
          username: testBookingInfo.user,
        },
      },
      remark: testBookingInfo.remark,
    },
  });
};

export const deleteBookings = async (): Promise<void> => {
  await prisma.booking.deleteMany({});
};

export const deleteBooking = async booking => {
  return prisma.booking.delete({
    where: { id: booking.id },
  });
};
