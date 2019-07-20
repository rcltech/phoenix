const { ApolloServer, gql } = require('apollo-server');
const { Client } = require('pg');
const env = require('dotenv');
env.config();

const typeDefs = require('./src/schema');
const resolvers = require('./src/resolvers');
const Users = require('./src/datasources/users');
const Society = require('./src/datasources/society');

const client = new Client();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
        users: new Users(client),
        societies: new Society(client),
    }),
});

server.listen().then(async ({ url }) => {
    await client.connect();
    console.log(`${url}`);
});
