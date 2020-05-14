import * as jwt from "jsonwebtoken";
import { Prisma, User, UserSession } from "../generated/prisma-client";

export const resolveUserUsingJWT = async (
  prisma: Prisma,
  token: string
): Promise<User> => {
  try {
    const userSession: UserSession = jwt.verify(
      token,
      process.env.PRISMA_SECRET
    ) as UserSession;
    const sessionId = userSession.id;
    return prisma.userSession({ id: sessionId }).user();
  } catch (e) {
    return null;
  }
};
