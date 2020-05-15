import { Event, FragmentableArray } from "../generated/prisma-client";
import moment from "moment";

export const events = (
  parent,
  { data, start_limit },
  ctx
): FragmentableArray<Event> => {
  const end_gte: Date = moment(start_limit, moment.defaultFormat).isValid()
    ? new Date(start_limit)
    : new Date();
  return ctx.prisma.events({
    where: { ...data, end_gte },
    orderBy: "start_ASC",
  });
};
