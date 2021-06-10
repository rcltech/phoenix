import * as env from "dotenv";
env.config();

import gql from "graphql-tag";
import jwt from "jsonwebtoken";
import { Washer } from "@prisma/client";
import { GraphQLResponse } from "apollo-server-types";
import { createTestClient } from "apollo-server-testing";
import { createTestServerWithToken } from "./utils/server";
import { setupPrismaForTesting } from "./utils/setupPrismaForTesting";

const prisma = setupPrismaForTesting();

const createTestWasher = (washer: {
  id: string;
  in_use: boolean;
}): Promise<Washer> => prisma.washer.create({ data: washer });

const deleteTestWashers = async (): Promise<void> => {
  await prisma.washer.deleteMany({});
};

const testWasher = {
  id: "1",
  in_use: true,
};

beforeAll(async () => {
  await deleteTestWashers();
});

afterEach(async () => await deleteTestWashers());

afterAll(async done => {
  await prisma.$disconnect();
  done();
});

describe("the graphql washers api", () => {
  test("returns the status of the washing machines", async () => {
    // create a test server with token
    const testServer = createTestServerWithToken("some_token");
    // create a test client connected to the test server
    const client = createTestClient(testServer);
    // create a test washer
    await createTestWasher(testWasher);

    // query and check response
    const query = gql`
      query {
        washers {
          id
          in_use
        }
      }
    `;
    const response: GraphQLResponse = await client.query({ query });
    expect(response.data).toEqual({
      washers: [testWasher],
    });
  });

  test("updates the status of a machine", async () => {
    // generate a token
    const token = jwt.sign("sls to phoenix", process.env.SLS_SECRET);
    // create a test server with token
    const testServer = createTestServerWithToken(token);
    // create a test client connected to the test server
    const client = createTestClient(testServer);

    await createTestWasher(testWasher);

    // update and check response
    const mutation = gql`
      mutation($id: ID!, $in_use: Boolean!) {
        updateWasher(id: $id, in_use: $in_use) {
          id
          in_use
        }
      }
    `;
    const variables = { id: "1", in_use: false };
    const response: GraphQLResponse = await client.mutate({
      mutation,
      variables,
    });
    expect(response.data).toEqual({ updateWasher: { id: "1", in_use: false } });
  });
});
