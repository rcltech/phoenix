import { Booking, Room } from "@prisma/client";
import moment from "moment";
import { AppContext } from "../context";

export const bookings = async (
  parent,
  { data, start_limit },
  ctx: AppContext
): Promise<Booking[]> => {
  const end_gte: Date = moment(start_limit, moment.defaultFormat).isValid()
    ? new Date(start_limit)
    : new Date();
  return ctx.prisma.booking.findMany({
    where: { ...data, end: { gte: end_gte } },
    orderBy: { start: "asc" },
  });
};

export const rooms = async (
  parent,
  { data },
  ctx: AppContext
): Promise<Room[]> => ctx.prisma.room.findMany({ where: data });
