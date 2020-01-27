import { ApolloServer } from "apollo-server-express";
import * as env from "dotenv";
import typeDefs from "../../src/schema";
import resolvers from "../../src/resolvers";
import { prisma } from "../../src/generated/prisma-client";
import { createUserSession } from "./users";
import { generateToken } from "../../src/utils/authToken";

env.config();

export const createTestServerWithToken = (token): ApolloServer => {
  return new ApolloServer({
    typeDefs,
    resolvers,
    context: (): object => ({
      prisma,
      token,
    }),
  });
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
