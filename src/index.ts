import * as env from "dotenv";
env.config();

import server from "./server";
import express from "express";
import cors, { CorsOptions } from "cors";
import { auth, adminAuth } from "./auth";
import * as bodyParser from "body-parser";

const corsOptions: CorsOptions = {
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

app.use(bodyParser.json({ type: "application/json" }));

app.use("/oauth", auth);
app.use("/oauth/admin", adminAuth);

app.listen({ port: PORT }, () => {
  console.log(`Server started at port ${PORT}`);
});
