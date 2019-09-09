const {ApolloServer}  = require("apollo-server");
import * as env from "dotenv";
env.config();
import typeDefs from './schema';
import resolvers from "./resolvers";
import {prisma} from './generated/prisma-client';

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: {
        prisma,
    },
} as any);

server.listen().then(async ({ url }) => {
    console.log(`${url}`);
});
