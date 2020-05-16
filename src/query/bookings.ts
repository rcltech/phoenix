import { Booking, FragmentableArray, Room } from "../generated/prisma-client";
import moment from "moment";

export const bookings = (
  parent,
  { data, start_limit },
  ctx
): FragmentableArray<Booking> => {
  const end_gte: Date = moment(start_limit, moment.defaultFormat).isValid()
    ? new Date(start_limit)
    : new Date();
  return ctx.prisma.bookings({
    where: { ...data, end_gte },
    orderBy: "start_ASC",
  });
};

export const rooms = (parent, { data }, ctx): FragmentableArray<Room> =>
  ctx.prisma.rooms(data);
