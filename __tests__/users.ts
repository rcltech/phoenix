import * as env from "dotenv";
env.config();

import { prisma } from "../src/generated/prisma-client";
import testServer from "../src/server";
import { createTestClient } from "apollo-server-testing";

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

describe("User query and mutations", () => {
  test("can query user", async done => {
    await deleteUsers();
    await createUser(testUserInfo);
    const client = createTestClient(testServer);
    const userQuery = `{
        user (username: "${testUserInfo.username}") {
            username,
            first_name,
            last_name,
            room_no
        }}`;
    const result = await client.query({ query: userQuery });
    expect(result.data).toEqual({
      user: {
        username: testUserInfo.username,
        first_name: testUserInfo.first_name,
        last_name: testUserInfo.last_name,
        room_no: testUserInfo.room_no,
      },
    });
    await deleteUsers();
    done();
  });
  test("can add user", async done => {
    await deleteUsers();
    const client = createTestClient(testServer);
    const userMutation = `mutation addUser 
        {
          createUser(
            username: "${testUserInfo.username}",
            email: "${testUserInfo.email}",
            image_url:"${testUserInfo.image_url}",
            phone: "${testUserInfo.phone}",
            first_name:"${testUserInfo.first_name}",
            last_name:"${testUserInfo.last_name}",
            room_no:"${testUserInfo.room_no}"
          ){
          username
          }
        }`;
    await client.mutate({ mutation: userMutation });
    const userQueryResult = await prisma.user({
      username: testUserInfo.username,
    });
    expect(userQueryResult).toMatchObject(testUserInfo);
    await deleteUsers();
    done();
  });
  test("can delete user", async done => {
    await deleteUsers();
    const client = createTestClient(testServer);
    await createUser(testUserInfo);
    const userDeleteMutation = `
        mutation delete{
            deleteUser(username: "${testUserInfo.username}"){
                username
            }
        }`;
    await client.mutate({ mutation: userDeleteMutation });
    const userQueryResult = await prisma.user({
      username: testUserInfo.username,
    });
    expect(userQueryResult).toEqual(null);
    await deleteUsers();
    done();
  });
});
