import * as env from "dotenv";
import { PrismaClient, User, UserSession, Role } from "@prisma/client";

env.config();

const prisma = new PrismaClient();

export type TestUserInfo = {
  username: string;
  email: string;
  image_url: string;
  phone: string;
  first_name: string;
  last_name: string;
  room_no: string;
  role: Role;
};

export const createUser = (user): Promise<User> => {
  return prisma.user.create({ data: user });
};

export const deleteUser = async (user: User): Promise<User> => {
  await prisma.userSession.deleteMany({});
  return prisma.user.delete({ where: { username: user.username } });
};

export const deleteUsers = async (...users: User[]): Promise<User[]> => {
  if (users.length === 0) {
    const allUsers = await prisma.user.findMany({});
    await prisma.userSession.deleteMany({});
    await prisma.user.deleteMany({});
    return allUsers;
  }
  return Promise.all(
    users.map(async user => {
      return deleteUser(user);
    })
  );
};

export const createUserSession = (user: User): Promise<UserSession> => {
  return prisma.userSession.create({
    data: {
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });
};
