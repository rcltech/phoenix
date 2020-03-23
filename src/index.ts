import * as env from "dotenv";
env.config();

import server from "./server";
import express from "express";

const app: express.Application = express();

const PORT: string = process.env.PORT || "4000";

server.applyMiddleware({
  app,
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
