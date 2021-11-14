import { ApolloServer } from "apollo-server-express";
import * as env from "dotenv";
import { createUserSession } from "./users";
import { generateToken } from "../../src/utils/authToken";
import server from "../../src/initialiseServer";
import { AppContext, context } from "../../src/context";
import { User } from "@prisma/client";

env.config();

export const createTestServerWithToken = (token: string): ApolloServer => {
  const testReq = {
    headers: {
      authorization: token,
    },
  };
  const testServerContext = async ({ req }): Promise<AppContext> => {
    return await context({ req: testReq });
  };

  return server(testServerContext);
};

export const createTestServerWithUserLoggedIn = async (
  user: User
): Promise<ApolloServer> => {
  const userSession = await createUserSession(user);
  // Generate a token for the session
  const token = generateToken(userSession);
  //Create a test server
  return createTestServerWithToken(token);
};
