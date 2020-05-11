import { ApolloServer, makeExecutableSchema } from "apollo-server-express";
import * as env from "dotenv";
env.config();

import typeDefs from "./schema";
import resolvers from "./resolvers";
import { prisma, Prisma, User } from "./generated/prisma-client";
import Cookies from "universal-cookie";
import { resolveUserUsingJWT } from "./utils/resolveUser";
import { applyMiddleware } from "graphql-middleware";
import { permissions } from "./shield/permissions";

/**
 * @author utkarsh867
 * Note that the server instance used in the tests is not the same. This means
 * that when there is a change to the instance of the server underneath, make
 * sure to make the same changes in the tests.
 */

export type AppContext = {
  prisma: Prisma;
  token: string;
  auth: {
    user: User;
    isAuthenticated: boolean;
  };
};

const server: ApolloServer = new ApolloServer({
  schema: applyMiddleware(
    makeExecutableSchema({
      typeDefs,
      resolvers,
    }),
    permissions
  ),
  context: async ({ req }): Promise<AppContext> => {
    const cookies = new Cookies(req && req.headers.cookie);
    const cookieToken: string = cookies.get("RCTC_USER");
    const fallbackToken = req && req.headers.authorization;
    const token: string = cookieToken || fallbackToken;
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

export default server;
