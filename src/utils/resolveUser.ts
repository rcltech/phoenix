import * as jwt from "jsonwebtoken";
import { Prisma, User, UserSessions } from "../generated/prisma-client";

export const resolveUserUsingJWT = async (
  prisma: Prisma,
  token: string
): Promise<User> | null => {
  try {
    const userSession: UserSessions = jwt.verify(
      token,
      process.env.PRISMA_SECRET
    ) as UserSessions;
    const sessionId = userSession.id;
    return prisma.userSessions({ id: sessionId }).user();
  } catch (e) {
    return null;
  }
};
