import { Washer } from "@prisma/client";
import { AppContext } from "../context";

export const washers = (parent, { data }, ctx: AppContext): Promise<Washer[]> =>
  ctx.prisma.washer.findMany({ where: data, orderBy: { id: "asc" } });
