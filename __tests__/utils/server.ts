import { ApolloServer, makeExecutableSchema } from "apollo-server-express";
import * as env from "dotenv";
import typeDefs from "../../src/schema";
import resolvers from "../../src/resolvers";
import { prisma, User } from "../../src/generated/prisma-client";
import { createUserSession } from "./users";
import { generateToken } from "../../src/utils/authToken";
import { resolveUserUsingJWT } from "../../src/utils/resolveUser";
import { applyMiddleware } from "graphql-middleware";
import { permissions } from "../../src/shield/permissions";
import server from "../../src/server";
import { context, AppContext } from "../../src/context";
env.config();

export const createTestServerWithToken = (token: string): ApolloServer => {
  const testReq = {
    headers: {
      authorization: token,
    },
  };
  const testServerContext = async ({ req }): Promise<AppContext> => {
    const appContext: AppContext = await context({ req: testReq });
    return appContext;
  };

  const testServer = server(testServerContext);
  return testServer;
};

export const createTestServerWithUserLoggedIn = async (
  user
): Promise<ApolloServer> => {
  const userSession = await createUserSession(user);
  // Generate a token for the session
  const token = generateToken(userSession);
  //Create a test server
  return createTestServerWithToken(token);
};
