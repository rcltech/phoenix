import * as env from "dotenv";
env.config();

import { BatchPayload, prisma, Washer } from "../src/generated/prisma-client";
import { createTestClient } from "apollo-server-testing";
import testServer from "../src/server";

const createTestWasher = (washer): Promise<Washer> =>
  prisma.createWasher(washer);

const deleteTestWashers = (): Promise<BatchPayload> =>
  prisma.deleteManyWashers({});

const testWasher = {
  id: "1",
  status: "IDLE",
  time_elapsed: "0",
  time_remaining: "0",
};

beforeAll(async () => {
  await deleteTestWashers();
});

describe("the graphql washers api", () => {
  test("returns the status of the washing machines", async () => {
    const client = createTestClient(testServer);
    await deleteTestWashers();
    await createTestWasher(testWasher);
    const washerQuery = `{
            washer(id: ${testWasher.id}) {
                id
                status
                time_elapsed
                time_remaining
            }
        }`;
    const queryResponse = await client.query({ query: washerQuery });
    expect(queryResponse.data).toEqual({
      washer: testWasher,
    });
    await deleteTestWashers();
  });
});
