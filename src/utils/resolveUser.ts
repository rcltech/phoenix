import * as jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { User, UserSession } from "../generated/typegraphql-prisma";

export const resolveUserUsingJWT = async (
  prisma: PrismaClient,
  token: string
): Promise<User> => {
  try {
    const userSession: UserSession = jwt.verify(
      token,
      process.env.PHOENIX_SECRET
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
