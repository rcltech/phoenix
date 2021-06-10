import { importSchema } from "graphql-import";

export const typeDefs: string = importSchema("./src/schema.graphql");
