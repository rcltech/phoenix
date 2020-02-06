import { resolveUserUsingJWT } from "../utils/resolveUser";
import { Admin, User } from "../generated/prisma-client";

export const user = (parent, { username }, ctx): Promise<User> => {
  return ctx.prisma.user({
    username,
  });
};

export const adminUser = (parent, { username }, ctx): Promise<Admin> => {
  return ctx.prisma.admin({
    username,
  });
};

export const me = async (parent, args, ctx): Promise<User> => {
  return await resolveUserUsingJWT(ctx);
};
