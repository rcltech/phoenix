import { Booking } from "@prisma/client";

import { AppContext } from "../context";

type BookingData = {
  start: Date;
  end: Date;
};

export const validateBooking = async (
  roomNumber: string,
  booking: BookingData,
  { prisma }: AppContext,
  excludedBookingId?: string
): Promise<boolean> => {
  const clashedBookings: Booking[] = await prisma.booking.findMany({
    where: {
      id: excludedBookingId
        ? { not: { equals: excludedBookingId } }
        : undefined,
      room: { number: { equals: roomNumber } },
      OR: [
        {
          start: { gte: booking.start, lt: booking.end },
        },
        {
          end: { lte: booking.end, gt: booking.start },
        },
        {
          start: { lte: booking.start },
          end: { gte: booking.end },
        },
      ],
    },
  });

  return clashedBookings.length === 0;
};
