import * as env from "dotenv";
env.config();

import server from "./server";
const express = require("express");
const app = express();

const PORT = process.env.PORT || 4000;

server.applyMiddleware({ app });

app.get("/", (req, res) => {
  res.send("OK").status(200);
});

app.listen({ port: PORT }, () => {
  console.log(`Server started at port ${PORT}`);
});
