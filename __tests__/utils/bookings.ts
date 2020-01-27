import * as env from "dotenv";
import {
  BatchPayloadPromise,
  Booking,
  prisma,
} from "../../src/generated/prisma-client";

env.config();

export const createBooking = (testBookingInfo: any): Promise<Booking> => {
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
