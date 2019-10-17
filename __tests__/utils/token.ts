import * as env from "dotenv";
env.config();

import { prisma, User } from "../../src/generated/prisma-client";
import { createTestClient } from "apollo-server-testing";
import testServer from "../../src/server";
import { generateToken } from "../../src/utils/authToken";
import { resolveUserUsingJWT } from "../../src/utils/resolveUser";

const createUser = async user => {
  await prisma.createUser(user);
};

const deleteUsers = async () => {
  return prisma.deleteManyUsers({});
};

const testUserInfo = {
  username: "test123",
  email: "test@gmail.com",
  image_url: "http://url",
  phone: "12345678",
  first_name: "Test",
  last_name: "Test",
  room_no: "111A",
};

describe("the authentication system", () => {
  test("can generate a token that is reliable", async done => {
    const client = createTestClient(testServer);
    await deleteUsers();
    await createUser(testUserInfo);
    const user: User = await prisma.user({ username: testUserInfo.username });
    const token = generateToken(user);
    expect(resolveUserUsingJWT(token)).toMatchObject(user);
    done();
  });
});
