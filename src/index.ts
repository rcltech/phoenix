import * as env from "dotenv";
env.config();

import server from "./server"
const express = require("express");
const app = express();

server.applyMiddleware({app});

app.get("/", (req, res) => {
    res.send("OK").status(200);
});

app.listen({port: 4000} , () => {
   console.log("Server started at port 4000");
});