import { FragmentableArray, User } from "../generated/prisma-client";

export const user = (parent, { username }, ctx): FragmentableArray<User> => {
  return ctx.prisma.user({
    username,
  });
};

export const me = async (parent, args, ctx): Promise<User> => {
  return ctx.auth.user;
};
