import * as env from "dotenv";
import {
  BatchPayload,
  prisma,
  User,
  UserSession,
} from "../../src/generated/prisma-client";

env.config();

export const createUser = (user): Promise<User> => {
  return prisma.createUser(user);
};

export const deleteUsers = (): Promise<BatchPayload> => {
  return prisma.deleteManyUsers({});
};

export const deleteUser = (user: User) => {
  return prisma.deleteUser({
    id: user.id,
  });
};

export const createUserSession = (user: User): Promise<UserSession> => {
  return prisma.createUserSession({
    user: {
      connect: {
        id: user.id,
      },
    },
  });
};
