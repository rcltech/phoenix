import typeDefs from '../src/schema';
import resolvers from '../src/resolvers';
import { prisma } from '../src/generated/prisma-client';

const { ApolloServer } = require('apollo-server');
const { createTestClient } = require('apollo-server-testing');


const testApolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: {
        prisma,
    },
} as any);

const createTestWasher = async (washer) => {
    await prisma.createWasher(washer);
};

const deleteTestWashers = async () => {
    return prisma.deleteManyWashers({})
};

const testWasher = {
    id: "1",
    status:"IDLE",
    time_elapsed: "0",
    time_remaining:"0"
};

describe('the graphql washers api', () => {
    it('returns the status of the washing machines', async (done) => {

        const client = createTestClient(testApolloServer);
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
        const queryResponse = await client.query({query: washerQuery});
        expect(queryResponse.data).toEqual({
            washer: testWasher
        });
        await deleteTestWashers();
        done()
    });

    it('writes status of the washing machines', () => {

    });
});
