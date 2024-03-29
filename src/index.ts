import "reflect-metadata";
import * as env from "dotenv";
env.config();

import express from "express";
import cors, { CorsOptions } from "cors";
import morgan from "morgan";

import { initialiseServer } from "./initialiseServer";
import { context } from "./context";
import { auth, adminAuth } from "./auth";

const corsOptions: CorsOptions = {
  origin: [
    "https://ladybird.rctech.club",
    "https://owl.rctech.club",
    "https://events.rctech.club",
    "https://sls.rctech.club",
    "http://localhost:3000",
    "http://localhost:3001",
  ],
  credentials: true,
};

const app: express.Application = express();

app.use(cors(corsOptions));

app.use(morgan("tiny"));

app.get("/", (req, res) => {
  res.send("OK").status(200);
});

app.use(express.json());

app.use("/oauth/user", auth);
app.use("/oauth/admin", adminAuth);

async function start() {
  const apolloServer = await initialiseServer(context);

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    cors: corsOptions,
    path: "/graphql",
    bodyParserConfig: {
      limit: "50mb",
    },
  });

  const PORT: string = process.env.PORT || "4000";

  app.listen({ port: PORT }, () => {
    console.log(`Server started at port ${PORT}`);
  });
}

start().then();
