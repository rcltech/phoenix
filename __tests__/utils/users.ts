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

export const deleteUser = (user: User) => {
  return prisma.deleteUser({
    username: user.username,
  });
};

export const deleteUsers = async (
  ...users: User[]
): Promise<User[] | BatchPayload> => {
  if (users.length === 0) {
    return prisma.deleteManyUsers({});
  }
  const deletedUsers = Promise.all(
    users.map(async user => {
      return deleteUser(user);
    })
  );
  return deletedUsers;
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
