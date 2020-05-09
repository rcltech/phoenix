import { Event, FragmentableArray } from "../generated/prisma-client";
import moment from "moment";

export const events = (
  parent,
  { data, start },
  ctx
): FragmentableArray<Event> => {
  if (moment(start, moment.defaultFormat).isValid()) {
    const start_gte: Date = new Date(start);
    return ctx.prisma.events({
      where: { ...data, start_gte },
      orderBy: "start_ASC",
    });
  } else return ctx.prisma.events({ where: data, orderBy: "start_ASC" });
};
