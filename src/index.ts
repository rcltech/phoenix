import * as env from "dotenv";
env.config();

import { sendEmail } from './utils/sendEmail';
import server from "./server";
import express from "express";

const app: express.Application = express();

const PORT: string = process.env.PORT || "4000";

server.applyMiddleware({ app });

app.get("/", (req, res) => {
  res.send("OK").status(200);
});

app.post("/email", (req, res) => {
  const bookingData = {};
  sendEmail(bookingData);
  res.send("OK").status(200);
});

app.listen({ port: PORT }, () => {
  console.log(`Server started at port ${PORT}`);
});