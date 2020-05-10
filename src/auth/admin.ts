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
  const adminUser = await prisma.user({ username: username });
  if (adminUser.role === "ADMIN") {
    const hashedPassword = adminUser.password;
    if (await bcrypt.compare(password, hashedPassword)) {
      const adminSession = await prisma.createUserSession({
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
  } else {
    res.status(401).send("User with the username is not ADMIN");
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
    await prisma.createUser({
      username: username,
      password: hash,
      email: username,
      first_name: "Admin",
      last_name: "Admin",
      room_no: "ADMIN",
      image_url: "",
      phone: "",
      role: "ADMIN",
    });
    res.status(200).send(`User: ${username} is registered`);
  });
});

export { router as adminAuth };
