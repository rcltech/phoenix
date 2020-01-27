import { importSchema } from "graphql-import";

const typeDefs: string = importSchema("./src/schema.graphql");

export default typeDefs;
