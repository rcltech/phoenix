import { ApolloServer, makeExecutableSchema } from "apollo-server-express";
import { Context, ContextFunction } from "apollo-server-core";
import { ExpressContext } from "apollo-server-express/src";
import * as env from "dotenv";
env.config();

import { typeDefs } from "./typedefs";
import { resolvers } from "./resolvers";
import { applyMiddleware } from "graphql-middleware";
import { permissions } from "./shield/permissions";

const server = (
  context: ContextFunction<ExpressContext, Context> | Context
): ApolloServer =>
  new ApolloServer({
    schema: applyMiddleware(
      makeExecutableSchema({
        typeDefs,
        resolvers,
      }),
      permissions
    ),
    context,
    playground: true,
    introspection: true,
    debug: process.env.NODE_ENV !== "production",
  });

export default server;
