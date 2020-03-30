import { Washer } from "../generated/prisma-client";

const updateWasher = async (parent, { id, in_use }, ctx): Promise<Washer> => {
  return ctx.prisma.updateWasher({
    data: {
      in_use,
    },
    where: {
      id,
    },
  });
};

export { updateWasher };
