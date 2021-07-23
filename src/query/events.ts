import { Event } from "@prisma/client";
import moment from "moment";
import { AppContext } from "../context";

export const events = async (
  parent,
  { data, start_limit },
  ctx: AppContext
): Promise<Event[]> => {
  const end_gte: Date = moment(start_limit, moment.defaultFormat).isValid()
    ? new Date(start_limit)
    : undefined;
  return ctx.prisma.event.findMany({
    where: { ...data, end: { gte: end_gte } },
    orderBy: { start: "asc" },
  });
};
