import { ApolloServer } from "apollo-server-express";
import { createUserSession } from "./users";
import { generateToken } from "../../src/utils/authToken";
import { initialiseServer } from "../../src/initialiseServer";
import { AppContext, context } from "../../src/context";
import { User } from "@prisma/client";

export const createTestServerWithToken = async (
  token: string
): Promise<ApolloServer> => {
  const testReq = {
    headers: {
      authorization: token,
    },
  };
  const testServerContext = async (): Promise<AppContext> => {
    return await context({ req: testReq });
  };

  return await initialiseServer(testServerContext);
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
