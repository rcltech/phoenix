import * as env from "dotenv";
env.config();

import express from "express";
import { prisma, User, UserSessions } from "../generated/prisma-client";
import { OAuth2Client } from "google-auth-library";
import { generateToken } from "../utils/authToken";

const client: OAuth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const router = express.Router();

router.post("/login", async (req, res) => {
  res.status(501).send("Not implemented");
});

export { router as adminAuth };
