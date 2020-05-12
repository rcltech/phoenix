import * as env from "dotenv";
env.config();

import express from "express";
import { prisma } from "../generated/prisma-client";
import { OAuth2Client } from "google-auth-library";
import { generateToken } from "../utils/authToken";
import { TokenPayload } from "google-auth-library/build/src/auth/loginticket";

const client: OAuth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const router = express.Router();

async function getPayloadFromGoogle(
  token: string
): Promise<TokenPayload> | null {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    return ticket.getPayload();
  } catch (e) {
    console.log(e);
    return null;
  }
}

router.post("/login", async (req, res) => {
  const token: string = req.headers.authorization;
  const payload = await getPayloadFromGoogle(token);
  if (payload === null) {
    res
      .status(401)
      .send(
        "Not using valid email address. Check if the email address ends with @connect.hku.hk"
      );
    return;
  }

  // Get the user from the email address.
  const user = await prisma.user({ email: payload.email });
  if (user === null) {
    res.send(200).send({ registered: false, logged_in: false, token: null });
    return;
  }

  // Create a user session for the user
  const userSession = await prisma.createUserSession({
    user: {
      connect: {
        id: user.id,
      },
    },
  });

  // If the user session could not be created, return an internal server error.
  if (userSession === null) {
    res
      .status(500)
      .send(
        "There was an error in the server when resolving the user session."
      );
    return;
  }

  // Generate a JWT token for the user.
  const jwtToken = generateToken(userSession);
  res.status(200).send({ registered: true, logged_in: true, token: jwtToken });
});

export { router as auth };
