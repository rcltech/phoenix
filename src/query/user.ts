import { resolveUserUsingJWT } from "../utils/resolveUser";
import { FragmentableArray, User } from "../generated/prisma-client";

const user = (parent, { username }, ctx): FragmentableArray<User> => {
  return ctx.prisma.user({
    username,
  });
};

const me = async (parent, {}, ctx): Promise<User> => {
  return await resolveUserUsingJWT(ctx);
};

export { user, me };
