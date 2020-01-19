import { FragmentableArray, Washer } from "../generated/prisma-client";

const washer = (parent, { id }, ctx): FragmentableArray<Washer> =>
  ctx.prisma.washer({
    id,
  });

export default washer;
