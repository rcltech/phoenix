import { Booking, FragmentableArray, Room } from "../generated/prisma-client";
import moment from "moment";

export const bookings = (
  parent,
  { data, start },
  ctx
): FragmentableArray<Booking> => {
  if (moment(start, moment.defaultFormat).isValid()) {
    const start_gte: Date = new Date(start);
    return ctx.prisma.bookings({
      where: { ...data, start_gte },
      orderBy: "start_ASC",
    });
  } else return ctx.prisma.bookings({ where: data, orderBy: "start_ASC" });
};

export const rooms = (parent, { data }, ctx): FragmentableArray<Room> =>
  ctx.prisma.rooms(data);
