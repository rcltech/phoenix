import * as env from "dotenv";
env.config();

import server from "./server";
import express from "express";
import cors from "cors";

const corsOptions = {
  origin: [
    "https://ladybird.rctech.club",
    "https://owl.rctech.club",
    "https://events.rctech.club",
    "http://localhost:3000",
    "http://localhost:3001",
  ],
  credentials: true,
};

const app: express.Application = express();

app.use(cors(corsOptions));

const PORT: string = process.env.PORT || "4000";

server.applyMiddleware({
  app,
  cors: corsOptions,
  bodyParserConfig: {
    limit: "50mb",
  },
});

app.get("/", (req, res) => {
  res.send("OK").status(200);
});

app.listen({ port: PORT }, () => {
  console.log(`Server started at port ${PORT}`);
});
