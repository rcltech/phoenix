import { Event, FragmentableArray } from "../generated/prisma-client";

export const events = (parent, { data }, ctx): FragmentableArray<Event> => {
  return ctx.prisma.events({ where: data, orderBy: "start_ASC" });
};
