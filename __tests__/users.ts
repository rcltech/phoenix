import * as env from "dotenv";
import { User } from "../src/generated/prisma-client";
import testServer from "../src/server";
import { createTestClient } from "apollo-server-testing";
import { createTestServerWithToken } from "./utils/server";
import { generateToken } from "../src/utils/authToken";
import { GraphQLResponse } from "apollo-server-types";
import { createUser, createUserSession, deleteUsers } from "./utils/users";

env.config();

const testUserInfo = {
  username: "test123",
  email: "test@connect.hku.hk",
  image_url: "http://url",
  phone: "12345678",
  first_name: "Test",
  last_name: "Test",
  room_no: "111A",
};

beforeAll(async () => await deleteUsers());

describe("User query and mutations", () => {
  /**
   * @author utkarsh867
   */
  test("can query user", async () => {
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
    const result: GraphQLResponse = await client.query({ query: userQuery });
    expect(result.data).toEqual({
      user: {
        username: testUserInfo.username,
        first_name: testUserInfo.first_name,
        last_name: testUserInfo.last_name,
        room_no: testUserInfo.room_no,
      },
    });
    await deleteUsers();
  });

  /**
   * @author utkarsh867
   */
  test("can resolve user from the session", async () => {
    await deleteUsers();
    // Create user in the database
    const user: User = await createUser(testUserInfo);
    // Create the user session (bypass login)
    const userSession = await createUserSession(user);
    // Generate a token for the session
    const token = generateToken(userSession);
    // Create a test server from the token
    const testServer = createTestServerWithToken(token);
    // Create a test client connected to the test server
    const client = createTestClient(testServer);

    // Make a request to resolve the user
    const query = `{
      me {
        id
      }
    }`;
    const response: GraphQLResponse = await client.query({ query });

    // Check if the user from the query is correct
    expect(response.data).toEqual({
      me: {
        id: user.id,
      },
    });

    // Cleanup after the test
    await deleteUsers();
  });
});
