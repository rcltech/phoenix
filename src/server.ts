import {ApolloServer} from "apollo-server-express"
import * as env from "dotenv";
env.config();

import typeDefs from './schema';
import resolvers from "./resolvers";
import {prisma} from './generated/prisma-client';

const server : ApolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    prisma,
  },
});

export default server;