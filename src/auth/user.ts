import * as env from "dotenv";
env.config();

import express from "express";
import { prisma, User, UserSessions } from "../generated/prisma-client";
import { OAuth2Client } from "google-auth-library";
import { generateToken } from "../utils/authToken";

const client: OAuth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const router = express.Router();

router.post("/login", async (req, res) => {
  const token: string = req.headers.authorization;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // Check if the user email is an HKU email address
    if (payload && payload.hd !== "connect.hku.hk") {
      res
        .status(401)
        .send(
          "Not using valid email address. Check if the email address ends with @connect.hku.hk"
        );
      return;
    }

    try {
      const user: User = await prisma.user({ email: payload.email });
      if (user == null) {
        res
          .send(200)
          .send({ registered: false, logged_in: false, token: null });
        return;
      }
      try {
        const userSession: UserSessions = await prisma.createUserSessions({
          user: {
            connect: {
              id: user.id,
            },
          },
        });
        try {
          const jwtToken = generateToken(userSession);
          res
            .status(200)
            .send({ registered: true, logged_in: true, token: jwtToken });
          return;
        } catch (e) {
          console.error(e);
          res
            .status(500)
            .send(
              "There was an error when generating the JWT token for the user session."
            );
          return;
        }
      } catch (e) {
        console.error(e);
        res
          .status(500)
          .send(
            "There was an error in the server when resolving the user session."
          );
        return;
      }
    } catch (e) {
      console.error(e);
      res
        .status(500)
        .send("There was an error in the server when resolving the user");
      return;
    }
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .send(
        "There was an error at the server when making the Google verification request"
      );
    return;
  }
});

export { router as auth };
