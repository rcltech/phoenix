import * as env from "dotenv";
import {
  BatchPayload,
  prisma,
  User,
  UserSessions,
} from "../../src/generated/prisma-client";

env.config();

export const createUser = (user): Promise<User> => {
  return prisma.createUser(user);
};

export const deleteUsers = (): Promise<BatchPayload> => {
  return prisma.deleteManyUsers({});
};

export const createUserSession = (user: User): Promise<UserSessions> => {
  return prisma.createUserSessions({
    user: {
      connect: {
        id: user.id,
      },
    },
  });
};