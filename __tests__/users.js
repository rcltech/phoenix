const {ApolloServer} = require('apollo-server');
const { createTestClient } = require('apollo-server-testing');
const typeDefs = require('../src/schema');
const resolvers = require('../src/resolvers');
const Users = require('../mocks/users');

const prepareServer = async () => {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        dataSources: () => ({
            users: new Users(),
        }),
    });
    return await server;
};

it('test query', async () => {
    const server = await prepareServer();
    const userQuery = `{
        user (id: "utkarsh867") {
            username,
            firstname,
            lastname,
            roomno
        }}`;
    const { query } = createTestClient(server);
    const result = await query({ query: userQuery});
    expect(result.data).toEqual({
        user: {
            username: "utkarsh867",
            firstname: "Utkarsh",
            lastname: "Goel",
            roomno: "924"
        }
    });
});