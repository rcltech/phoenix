import moment from "moment";
import { Booking } from "@prisma/client";

import { AppContext } from "../context";

type BookingData = {
  start: Date;
  end: Date;
};

const getTimeSlots = (start: Date, end: Date): Date[] => {
  const timeSlots: Date[] = [];
  const duration = moment(end).diff(moment(start), "hour");
  for (let i = 0; i < duration; i++) {
    const timeSlot = moment(start)
      .add(i, "hour")
      .toDate();
    timeSlots.push(timeSlot);
  }
  return timeSlots;
};

export const validateBooking = async (
  roomNumber: string,
  booking: BookingData,
  { prisma }: AppContext
): Promise<boolean> => {
  const existingBookings: Booking[] = await prisma.booking.findMany({
    where: {
      room: { number: { equals: roomNumber } },
      start: {
        gte: moment(booking.start)
          .startOf("date")
          .toDate(),
      },
      end: {
        lte: moment(booking.end)
          .endOf("date")
          .toDate(),
      },
    },
    orderBy: { start: "asc" },
  });

  const bookedTimeSlots: Date[] = [];
  for (const existingBooking of existingBookings) {
    const timeSlots = getTimeSlots(
      new Date(existingBooking.start),
      new Date(existingBooking.end)
    );
    bookedTimeSlots.push(...timeSlots);
  }

  const start = moment(booking.start);
  const end = moment(booking.end);
  if (start.isSameOrAfter(end)) return false;

  const index: number = bookedTimeSlots.findIndex(bookedTimeSlot => {
    const startOfTimeSlot = moment(bookedTimeSlot);
    const endOfTimeSlot = moment(bookedTimeSlot).add(1, "hour");
    return (
      startOfTimeSlot.isSameOrAfter(start) && endOfTimeSlot.isSameOrBefore(end)
    );
  });

  return index === -1;
};
