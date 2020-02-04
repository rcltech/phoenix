import moment from "moment";
import { Booking } from "../generated/prisma-client";

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

export const validateBooking = (
  booking: BookingData,
  existingBookings: [Booking]
): boolean => {
  const bookingTimeSlots = getTimeSlots(booking.start, booking.end);

  const bookedTimeSlots: Date[] = [];
  for (const existingBooking of existingBookings) {
    const timeSlots = getTimeSlots(
      new Date(existingBooking.start),
      new Date(existingBooking.end)
    );
    bookedTimeSlots.push(...timeSlots);
  }

  let index: number = -1;
  bookingTimeSlots.forEach(bookingTimeSlot => {
    if (index != -1) return;
    index = bookedTimeSlots.findIndex(bookedTimeSlot =>
      moment(bookedTimeSlot).isSame(bookingTimeSlot)
    );
  });

  return index === -1;
};
