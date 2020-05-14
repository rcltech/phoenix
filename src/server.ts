import { ApolloServer, makeExecutableSchema } from "apollo-server-express";
import * as env from "dotenv";
env.config();

import typeDefs from "./schema";
import resolvers from "./resolvers";
import { applyMiddleware } from "graphql-middleware";
import { permissions } from "./shield/permissions";

const server = (context): ApolloServer =>
  new ApolloServer({
    schema: applyMiddleware(
      makeExecutableSchema({
        typeDefs,
        resolvers,
      }),
      permissions
    ),
    context: context,
  });

export default server;
