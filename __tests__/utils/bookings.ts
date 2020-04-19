import * as env from "dotenv";
import {
  BatchPayloadPromise,
  Booking,
  prisma,
} from "../../src/generated/prisma-client";

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
  return prisma.createBooking({
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
  });
};

export const deleteBookings = (): BatchPayloadPromise => {
  return prisma.deleteManyBookings({});
};
