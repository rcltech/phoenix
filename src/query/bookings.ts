import { Booking, FragmentableArray } from "../generated/prisma-client";

const bookings = (parent, { data }, ctx): FragmentableArray<Booking> => {
  return ctx.prisma.bookings({ where: data, orderBy: "start_ASC" });
};

const rooms = (parent, { data }, ctx) => ctx.prisma.rooms(data);

export { bookings, rooms };
