import { ApolloServer } from "apollo-server-express";
import * as env from "dotenv";
env.config();

import typeDefs from "./schema";
import resolvers from "./resolvers";
import { prisma } from "./generated/prisma-client";
import Cookies from "universal-cookie";

/**
 * @author utkarsh867
 * Note that the server instance used in the tests is not the same. This means
 * that when there is a change to the instance of the server underneath, make
 * sure to make the same changes in the tests.
 */
const server: ApolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }): object => {
    // to get token from cookies
    const cookies = new Cookies(req && req.headers.cookie);
    const cookieToken = cookies.get("RCTC_USER");
    // token for backwards compatibility
    const fallbackToken = req && req.headers.authorization;

    return {
      prisma,
      token: cookieToken ? cookieToken : fallbackToken,
    };
  },
});

export default server;
