import Users from '../src/datasources/users';
const { ApolloServer, gql } = require('apollo-server');
const { createTestClient } = require('apollo-server-testing');
import { Pool } from 'pg';
import typeDefs from '../src/schema';
import resolvers from '../src/resolvers';
import * as env from 'dotenv';
import Washers from '../src/datasources/washers';

env.config();

const pool = new Pool();

const testApolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
        washers: new Washers(pool, 'test.washers'),
    }),
});

const createTestWasher = async (washer) => {
    const query = `INSERT INTO test.washers(
    id, status, "timeElapsed", "timeRemaining")
    VALUES ($1::numeric, $2::text, $3::numeric, $4::numeric);`;
    await pool.query(query, [washer.id, washer.status,washer.timeElapsed, washer.timeRemaining])
};

const deleteTestWashers = async () => {
    const query = `DELETE FROM test.washers`;
    await pool.query(query)
};

const testWasher = {
    id: 2,
    status:"IDLE",
    timeElapsed: "0",
    timeRemaining:"0"
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
                timeElapsed
                timeRemaining
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

afterAll(() => {
    pool.end();
});
