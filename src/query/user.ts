import { resolveUserUsingJWT } from "../utils/resolveUser";

const user = (parent, { username }, ctx) => {
  return ctx.prisma.user({
    username,
  });
};

const me = async (parent, {}, ctx) => {
  const user = await resolveUserUsingJWT(ctx);
  return user;
};

export { user, me };
