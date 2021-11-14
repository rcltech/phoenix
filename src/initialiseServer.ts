import * as env from "dotenv";
env.config();

import { ApolloServer } from "apollo-server-express";
import {
  Context,
  ContextFunction,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core";
import { ExpressContext } from "apollo-server-express/src";
import { buildSchema, NonEmptyArray } from "type-graphql";

import { resolvers } from "./resolvers";

export const initialiseServer = async (
  context: ContextFunction<ExpressContext, Context> | Context
): Promise<ApolloServer> => {
  const schema = await buildSchema({
    resolvers: [...resolvers] as NonEmptyArray<never>,
    emitSchemaFile: true,
  });

  return new ApolloServer({
    schema,
    context,
    introspection: true,
    debug: process.env.NODE_ENV === "development",
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
  });
};
