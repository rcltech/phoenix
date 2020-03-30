import * as env from "dotenv";
import { BatchPayload, prisma, Washer } from "../src/generated/prisma-client";
import { GraphQLResponse } from "apollo-server-types";
import { createTestClient } from "apollo-server-testing";
import { createTestServerWithToken } from "./utils/server";

env.config();

const createTestWasher = (washer: {
  id: string;
  in_use: boolean;
}): Promise<Washer> => prisma.createWasher(washer);

const deleteTestWashers = (): Promise<BatchPayload> =>
  prisma.deleteManyWashers({});

const testWasher = {
  id: "1",
  in_use: true,
};

beforeAll(async () => {
  await deleteTestWashers();
});

describe("the graphql washers api", () => {
  test("returns the status of the washing machines", async () => {
    // create a test server with token
    const testServer = createTestServerWithToken("some_token");
    // create a test client connected to the test server
    const client = createTestClient(testServer);

    await deleteTestWashers();
    await createTestWasher(testWasher);

    // query and check response
    const query = `{
      washers {
        id
        in_use
      }
    }`;
    const response: GraphQLResponse = await client.query({ query });
    expect(response.data).toEqual({
      washers: [testWasher],
    });

    await deleteTestWashers();
  });

  test("updates the status of a machine", async () => {
    // create a test server with token
    const testServer = createTestServerWithToken("some_token");
    // create a test client connected to the test server
    const client = createTestClient(testServer);

    await deleteTestWashers();
    await createTestWasher(testWasher);

    // update and check response
    const mutation = `{
      updateWasher(id: ID!, in_use: Boolean!) {
        id
        in_use
      }
    }`;
    const variables = { id: "1", in_use: false };
    const response: GraphQLResponse = await client.mutate({
      mutation,
      variables,
    });
    console.log(response);
    expect(response.data).toEqual({ washer: { id: "1", in_use: false } });

    await deleteTestWashers();
  });
});
