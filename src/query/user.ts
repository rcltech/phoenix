import { User } from "@prisma/client";
import { AppContext } from "../context";

export const user = (parent, { username }, ctx: AppContext): Promise<User> => {
  return ctx.prisma.user.findUnique({
    where: { username },
  });
};

export const me = async (parent, args, ctx): Promise<User> => {
  return ctx.auth.user;
};
