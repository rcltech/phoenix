import * as env from "dotenv";
env.config();

import { User } from "@prisma/client";
import { createTestClient } from "apollo-server-testing";
import {
  createTestServerWithUserLoggedIn,
  createTestServerWithToken,
} from "./utils/server";
import { GraphQLResponse } from "apollo-server-types";
import { createUser, deleteUser, TestUserInfo } from "./utils/users";
import gql from "graphql-tag";

const testUserInfo: TestUserInfo = {
  username: "test123",
  email: "test@connect.hku.hk",
  image_url: "http://url",
  phone: "12345678",
  first_name: "Test",
  last_name: "Test",
  room_no: "111A",
  role: "USER",
};

describe("User query and mutations", () => {
  /**
   * @author utkarsh867
   */
  test("can query user", async () => {
    const user: User = await createUser(testUserInfo);
    const testServer = await createTestServerWithUserLoggedIn(user);
    const client = createTestClient(testServer);

    const query = gql`{
      user (username: "${testUserInfo.username}") {
        username,
        first_name,
        last_name,
        room_no
      }
    }`;

    const response: GraphQLResponse = await client.query({ query });

    expect(response.data).toEqual({
      user: {
        username: testUserInfo.username,
        first_name: testUserInfo.first_name,
        last_name: testUserInfo.last_name,
        room_no: testUserInfo.room_no,
      },
    });
    await deleteUser(user);
  });

  /**
   * @author utkarsh867
   */
  test("cannot query user when not authorised", async () => {
    const testServer = createTestServerWithToken("");
    const client = createTestClient(testServer);
    const userQuery = gql`{
        user (username: "${testUserInfo.username}") {
            username,
            first_name,
            last_name,
            room_no
        }}`;
    const result: GraphQLResponse = await client.query({ query: userQuery });
    expect(result.errors[0].message).toEqual("Not Authorised!");
    expect(result.data).toEqual({ user: null });
  });

  /**
   * @author utkarsh867
   */
  test("can resolve user from the session", async () => {
    const user: User = await createUser(testUserInfo);
    const testServer = await createTestServerWithUserLoggedIn(user);
    const client = createTestClient(testServer);

    // Make a request to resolve the user
    const query = gql`
      {
        me {
          id
        }
      }
    `;
    const response: GraphQLResponse = await client.query({ query });
    expect(response.data).toEqual({
      me: {
        id: user.id,
      },
    });
    await deleteUser(user);
  });

  /**
   * @author utkarsh867
   */
  test("rejects the 'me' query when no user is logged in", async () => {
    // Create a test client connected to the test server
    const testServer = createTestServerWithToken("");
    const client = createTestClient(testServer);

    const query = gql`
      {
        me {
          id
        }
      }
    `;
    const response: GraphQLResponse = await client.query({ query });
    expect(response.data).toEqual({
      me: null,
    });
    expect(response.errors[0].message).toEqual("Not Authorised!");
  });
});
