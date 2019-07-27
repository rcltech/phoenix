const {ApolloServer, gql}  = require("apollo-server");
import {Client} from "pg";
import * as env from "dotenv";
env.config();

import typeDefs from "./schema"
import resolvers from "./resolvers";
import Users from "./datasources/users";
import  Society from "./datasources/society";

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
