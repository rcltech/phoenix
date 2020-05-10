import { ApolloServer } from "apollo-server-express";
import * as env from "dotenv";
import typeDefs from "../../src/schema";
import resolvers from "../../src/resolvers";
import { prisma, User } from "../../src/generated/prisma-client";
import { createUserSession } from "./users";
import { generateToken } from "../../src/utils/authToken";
import { resolveUserUsingJWT } from "../../src/utils/resolveUser";

env.config();

export const createTestServerWithToken = (token: string): ApolloServer => {
  return new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }): Promise<object> => {
      const user = await resolveUserUsingJWT(prisma, token);
      return {
        prisma,
        token,
        auth: {
          user: user,
          isAuthenticated: user !== null,
        },
      };
    },
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
