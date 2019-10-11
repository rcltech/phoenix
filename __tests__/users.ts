import * as env from 'dotenv';
env.config();
import { prisma } from '../src/generated/prisma-client';
import typeDefs from '../src/schema';
import resolvers from '../src/resolvers';

const { ApolloServer, gql } = require('apollo-server');
const { createTestClient } = require('apollo-server-testing');

const prepareServer = async () => {
    return new ApolloServer({
        typeDefs,
        resolvers,
        context: {
            prisma,
        },
    } as any);
};

const createUser = async (user) => {
    await prisma.createUser(user);
};

const deleteUsers = async () => {
    return prisma.deleteManyUsers({})
};

const findUser = async (username) => {
    return prisma.user({username});
};

const testUserInfo = {
    username: 'test123',
    email: 'test@gmail.com',
    image_url: 'http://url',
    phone: '12345678',
    first_name: 'Test',
    last_name: 'Test',
    room_no: '111A',
};

describe('User query and mutations', () => {
    it('can query user', async (done) => {
        const server = await prepareServer();
        const client = createTestClient(server);
        await deleteUsers();
        await createUser(testUserInfo);
        const userQuery = `{
        user (username: "${testUserInfo.username}") {
            username,
            first_name,
            last_name,
            room_no
        }}`;
        const result = await client.query({ query: userQuery });
        expect(result.data).toEqual({
            user: {
                username: testUserInfo.username,
                first_name: testUserInfo.first_name,
                last_name: testUserInfo.last_name,
                room_no: testUserInfo.room_no,
            },
        });
        done();
    });
    it('can add user', async (done) => {
        await deleteUsers();
        const server = await prepareServer();
        const client = createTestClient(server);
        const userMutation = `mutation addUser 
        {
          createUser(newUser: {
            username: "${testUserInfo.username}",
            email: "${testUserInfo.email}",
            image_url:"${testUserInfo.image_url}",
            phone: "${testUserInfo.phone}",
            first_name:"${testUserInfo.first_name}",
            last_name:"${testUserInfo.last_name}",
            room_no:"${testUserInfo.room_no}"
          }){
          username
          }
        }`;

        await client.mutate({ mutation: userMutation });
        await findUser(testUserInfo.username);
        await deleteUsers();
        done();
    });
    it('can delete user', async (done) => {
        await deleteUsers();
        const server = await prepareServer();
        const client = createTestClient(server);
        await createUser(testUserInfo);
        const userDeleteMutation = `
        mutation{
            deleteUser(username: "${testUserInfo.username}"){
                username
            }
        }`;
        await client.mutate(userDeleteMutation);

    })
});
