const { gql } = require('apollo-server');
import {importSchema} from "graphql-import"

const typeDefs = importSchema("./src/schema.graphql");

export default typeDefs;
