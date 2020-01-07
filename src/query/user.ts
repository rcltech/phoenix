import { resolveUserUsingJWT } from "../utils/resolveUser";

const user = (parent, { username }, ctx) => {
  return ctx.prisma.user({
    username,
  });
};

const me = async (parent, {}, ctx) => {
  return await resolveUserUsingJWT(ctx);
};

export { user, me };
