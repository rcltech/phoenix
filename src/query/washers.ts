import { FragmentableArray, Washer } from "../generated/prisma-client";

export const washers = (parent, { data }, ctx): FragmentableArray<Washer> =>
  ctx.prisma.washers({ where: data, orderBy: "id_ASC" });
