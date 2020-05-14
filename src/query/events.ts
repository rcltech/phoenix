import { Event, FragmentableArray } from "../generated/prisma-client";
import moment from "moment";

export const events = (
  parent,
  { data, start_time },
  ctx
): FragmentableArray<Event> => {
  const start_gte: Date = moment(start_time, moment.defaultFormat).isValid()
    ? new Date(start_time)
    : new Date();
  return ctx.prisma.events({
    where: { ...data, start_gte },
    orderBy: "start_ASC",
  });
};
