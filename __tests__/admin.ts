import * as env from "dotenv";
import { createTestClient } from "apollo-server-testing";
import { GraphQLResponse } from "apollo-server-types";
import { ApolloServer, gql } from "apollo-server-express";
import { createTestServerWithToken } from "./utils/server";
import { deleteAdminUsers } from "./utils/users";
env.config();

beforeAll(async () => {
  await deleteAdminUsers();
});

describe("Admin user", () => {
  test("can be registered", async () => {
    const server: ApolloServer = createTestServerWithToken(
      process.env.PRISMA_SECRET
    );
    const { mutate } = createTestClient(server);

    const mutation = gql`
      mutation {
        adminRegister(username: "admin", password: "admin") {
          username
        }
      }
    `;

    const result: GraphQLResponse = await mutate({ mutation });
    expect(result.data).toEqual({
      adminRegister: {
        username: "admin",
      },
    });
  });

  test("fails to register if token is not provided or is incorrect", async () => {
    const server: ApolloServer = createTestServerWithToken("");
    const { mutate } = createTestClient(server);

    const mutation = gql`
      mutation {
        adminRegister(username: "admin", password: "admin") {
          username
        }
      }
    `;

    const result: GraphQLResponse = await mutate({ mutation });
    expect(result.data).toEqual({
      adminRegister: null,
    });
  });

  test("can be logged in", async () => {
    const server: ApolloServer = createTestServerWithToken(
      process.env.PRISMA_SECRET
    );
    const { mutate } = createTestClient(server);

    const register = gql`
      mutation {
        adminRegister(username: "admin", password: "admin") {
          username
        }
      }
    `;

    await mutate({ mutation: register });

    const mutation = gql`
      mutation {
        adminLogin(username: "admin", password: "admin") {
          login_status
        }
      }
    `;

    const result = await mutate({ mutation });

    expect(result.data).toEqual({
      adminLogin: {
        login_status: true,
      },
    });
  });

  test("cannot be logged in when incorrect password", async () => {
    const server: ApolloServer = createTestServerWithToken(
      process.env.PRISMA_SECRET
    );
    const { mutate } = createTestClient(server);

    const register = gql`
      mutation {
        adminRegister(username: "admin", password: "admin") {
          username
        }
      }
    `;

    await mutate({ mutation: register });

    const mutation = gql`
      mutation {
        adminLogin(username: "admin", password: "admi") {
          login_status
        }
      }
    `;

    const result = await mutate({ mutation });

    expect(result.data).toEqual({
      adminLogin: null,
    });
  });

  test("cannot register with same username", async () => {
    const server: ApolloServer = createTestServerWithToken(
      process.env.PRISMA_SECRET
    );
    const { mutate } = createTestClient(server);

    const register = gql`
      mutation {
        adminRegister(username: "admin", password: "admin") {
          username
        }
      }
    `;

    await mutate({ mutation: register });

    const mutation = gql`
      mutation {
        adminRegister(username: "admin", password: "admin") {
          username
        }
      }
    `;

    const result = await mutate({ mutation });

    expect(result.data).toEqual({
      adminRegister: null,
    });
  });
});
