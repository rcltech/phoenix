import * as jwt from "jsonwebtoken";
import { Prisma, User, Admin } from "../generated/prisma-client";

interface SessionObject extends Object {
  id: string;
  createdAt?: string;
  iat: number;
}

export const resolveUserUsingJWT = async (
  prisma: Prisma,
  token: string
): Promise<any> => {
  try {
    const sessionObject = jwt.verify(
      token,
      process.env.PRISMA_SECRET
    ) as SessionObject;
    const userSession = await prisma.userSessions({ id: sessionObject.id });
    if (userSession === null) {
      const adminSession = await prisma.adminUserSession({
        id: sessionObject.id,
      });
      if (adminSession === null) {
        return null;
      } else {
        const userObject = await prisma
          .adminUserSession({ id: sessionObject.id })
          .user();
        return { user: userObject, priviledge: "admin" };
      }
    } else {
      const userObject = await prisma
        .userSessions({ id: sessionObject.id })
        .user();
      return { user: userObject, priviledge: "user" };
    }
  } catch (e) {
    console.log(e);
    return null;
  }
};
