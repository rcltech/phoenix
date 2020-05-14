import { Booking, FragmentableArray, Room } from "../generated/prisma-client";
import moment from "moment";

export const bookings = (
  parent,
  { data, start_time },
  ctx
): FragmentableArray<Booking> => {
  const start_gte: Date = moment(start_time, moment.defaultFormat).isValid()
    ? new Date(start_time)
    : new Date();
  return ctx.prisma.bookings({
    where: { ...data, start_gte },
    orderBy: "start_ASC",
  });
};

export const rooms = (parent, { data }, ctx): FragmentableArray<Room> =>
  ctx.prisma.rooms(data);
