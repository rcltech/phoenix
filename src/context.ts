import { prisma, Prisma, User } from "./generated/prisma-client";
import Cookies from "universal-cookie";
import { resolveUserUsingJWT } from "./utils/resolveUser";

export type AppContext = {
  prisma: Prisma;
  token: string;
  auth: {
    user: User;
    isAuthenticated: boolean;
  };
};

export const context = async ({ req }): Promise<AppContext> => {
  const cookies = new Cookies(req && req.headers && req.headers.cookie);
  const cookieToken: string = cookies.get("RCTC_USER");
  const fallbackToken = req && req.headers && req.headers.authorization;
  const token: string = cookieToken || fallbackToken;
  const user = await resolveUserUsingJWT(prisma, token);
  return {
    prisma,
    token,
    auth: {
      user: user,
      isAuthenticated: user !== null,
    },
  };
};
