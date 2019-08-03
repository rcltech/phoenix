const { ApolloServer, gql } = require('apollo-server');
const { createTestClient } = require('apollo-server-testing');
import { Pool } from 'pg';
import typeDefs from '../src/schema';
import resolvers from '../src/resolvers';
import Users from '../src/datasources/users';
import * as env from 'dotenv';

env.config();

const pool = new Pool();

const prepareServer = async () => {
    return new ApolloServer({
        typeDefs,
        resolvers,
        dataSources: () => ({
            users: new Users(pool, 'test.user'),
        }),
    });
};

const createUser = async (user) => {
    const response = await pool.query(
        `INSERT INTO test.user (
            username, email, "imageUrl", phone, firstname, lastname, roomno) VALUES (
            $1::text, $2::text, $3::text, $4::text, $5::text, $6::text, $7::text)
            returning username;`,
        [user.username, user.email, user.imageUrl, user.phone, user.firstname, user.lastname, user.roomno],
    );
};

const deleteUsers = async () => {
    const response = await pool.query(
        `DELETE FROM test.user`,
    );
};

const findUser = async (username) => {
    const response = await pool.query(
        `SELECT * FROM test.user WHERE username='${username}'`,
    );
    return response;
};

const testUserInfo = {
    username: 'test123',
    email: 'test@gmail.com',
    imageUrl: 'http://url',
    phone: '12345678',
    firstname: 'Test',
    lastname: 'Test',
    roomno: '111A',
};

afterAll(() => {
    pool.end();
});

test('can query user', async (done) => {
    const server = await prepareServer();
    const client = createTestClient(server);
    await deleteUsers();
    await createUser(testUserInfo);
    const userQuery = `{
        user (id: "${testUserInfo.username}") {
            username,
            firstname,
            lastname,
            roomno
        }}`;
    const result = await client.query({ query: userQuery });
    expect(result.data).toEqual({
        user: {
            username: testUserInfo.username,
            firstname: testUserInfo.firstname,
            lastname: testUserInfo.lastname,
            roomno: testUserInfo.roomno,
        },
    });
    done();
});

describe('User query and mutations', () => {
    test('can add user', async (done) => {
        await deleteUsers();
        const server = await prepareServer();
        const client = createTestClient(server);
        const userMutation = `mutation addUser 
        {
          addUser(newUser: {
            username: "${testUserInfo.username}",
            email: "${testUserInfo.email}",
            imageUrl:"${testUserInfo.imageUrl}",
            phone: "${testUserInfo.phone}",
            firstname:"${testUserInfo.firstname}",
            lastname:"${testUserInfo.lastname}",
            roomno:"${testUserInfo.roomno}"
          }){
          username
          }
        }`;

        const res = await client.mutate({ mutation: userMutation });
        await findUser(testUserInfo.username);
        await deleteUsers();
        done();
    });
});
