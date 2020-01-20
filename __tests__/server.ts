import { ApolloServer } from "apollo-server-express";
import * as env from "dotenv";
env.config();

import typeDefs from "../src/schema";
import resolvers from "../src/resolvers";
import { prisma } from "../src/generated/prisma-client";

export const createTestServerWithToken = (token): ApolloServer => {
  return new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({
      prisma,
      token,
    }),
  });
};

describe('Create test server function', () => {
  test("Returns an instance of the test server", () => {
    const testServer = createTestServerWithToken("hello");
    expect(testServer).not.toBeNull();
  })
});