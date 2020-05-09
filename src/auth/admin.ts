import * as env from "dotenv";
env.config();

import express from "express";
import { prisma } from "../generated/prisma-client";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
const router = express.Router();

const saltRounds = 10;

router.post("/login", async (req, res) => {
  if (!(req.body && req.body.username && req.body.password)) {
    res.status(400).send("There was no username or password");
    return;
  }
  const username: string = req.body.username;
  const password: string = req.body.password;

  const adminUser = await prisma.admin({ username: username });
  const hashedPassword = adminUser.password;
  if (await bcrypt.compare(password, hashedPassword)) {
    const adminSession = await prisma.createAdminUserSession({
      user: {
        connect: {
          id: adminUser.id,
        },
      },
    });
    const token = jwt.sign(adminSession, process.env.PRISMA_SECRET);
    res.status(200).send(token);
    return;
  } else {
    res.status(401).send("Incorrect password");
  }
});

router.post("/register", async (req, res) => {
  if (!(req.body && req.body.username && req.body.password)) {
    res.status(400).send("There was no username or password");
    return;
  }
  const username: string = req.body.username;
  const password: string = req.body.password;

  bcrypt.hash(password, saltRounds).then(async hash => {
    await prisma.createAdmin({
      username: username,
      password: hash,
    });
    res.status(200).send(`User: ${username} is registered`);
  });
});

export { router as adminAuth };
