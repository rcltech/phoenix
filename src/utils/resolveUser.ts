import * as jwt from "jsonwebtoken";
import { PrismaClient, User, UserSession } from "@prisma/client";

export const resolveUserUsingJWT = async (
  prisma: PrismaClient,
  token: string
): Promise<User> => {
  try {
    const userSession: UserSession = jwt.verify(
      token,
      process.env.PRISMA_SECRET
    ) as UserSession;
    const sessionId = userSession.id;
    const foundUserSession = await prisma.userSession.findUnique({
      where: { id: sessionId },
    });
    return prisma.user.findUnique({ where: { id: foundUserSession.userId } });
  } catch (e) {
    return null;
  }
};
