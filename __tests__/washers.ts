import * as env from 'dotenv';
env.config();

import { prisma } from "../src/generated/prisma-client";
import { createTestClient } from "apollo-server-testing";
import testServer from "../src/server";

const createTestWasher = async washer => {
    await prisma.createWasher(washer);
};

const deleteTestWashers = async () => {
    return prisma.deleteManyWashers({});
};

const testWasher = {
    id: "1",
    status: "IDLE",
    time_elapsed: "0",
    time_remaining: "0",
};

beforeAll( async () => {
    await deleteTestWashers();
});

describe("the graphql washers api", () => {
    test("returns the status of the washing machines", async done => {
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
        done();
    });

    it("writes status of the washing machines", () => {});
});
