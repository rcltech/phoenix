const {ApolloServer, gql}  = require("apollo-server");
import {Pool} from "pg";
import * as env from "dotenv";
env.config();

import typeDefs from "./schema"
import resolvers from "./resolvers";
import Users from "./datasources/users";
import  Society from "./datasources/society";

const pool:Pool = new Pool();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
        users: new Users(pool),
        societies: new Society(pool)
    }),
});

server.listen().then(async ({ url }) => {
    console.log(`${url}`);
});
