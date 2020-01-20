import { Booking, FragmentableArray, Room } from "../generated/prisma-client";

export const bookings = (parent, { data }, ctx): FragmentableArray<Booking> => {
  return ctx.prisma.bookings({ where: data, orderBy: "start_ASC" });
};

export const rooms = (parent, { data }, ctx): FragmentableArray<Room> =>
  ctx.prisma.rooms(data);
