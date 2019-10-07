const {ApolloServer}  = require("apollo-server-express");
const express = require("express");
const app = express();

import * as env from "dotenv";
env.config();
import typeDefs from './schema';
import resolvers from "./resolvers";
import {prisma} from './generated/prisma-client';

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: {
        prisma,
    },
} as any);

server.applyMiddleware({app});

app.get("/", (req, res) => {
    res.send("OK").status(200);
});

app.listen({port: 4000} , () => {
   console.log("Server started at port 4000");
});