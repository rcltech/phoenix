import * as env from "dotenv";
env.config();

import express from "express";
import { OAuth2Client } from "google-auth-library";
import { generateToken } from "../utils/authToken";
import { prisma } from "../utils/prisma";
import { TokenPayload } from "google-auth-library/build/src/auth/loginticket";
import { generateUsername as getUsername } from "unique-username-generator";

import { Role, User } from "../generated/typegraphql-prisma";

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

async function generateUniqueUsername(username?: string): Promise<string> {
  if (username) {
    const user = await prisma.user.findFirst({ where: { username } });
    if (!user) return username;
    else {
      return await generateUniqueUsername(getUsername());
    }
  } else {
    return await generateUniqueUsername(getUsername());
  }
}

async function createUserSessionToken(user: User): Promise<string> {
  // Create a user session for the user
  const userSession = await prisma.userSession.create({
    data: {
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  // Generate a JWT token for the user.
  return generateToken(userSession);
}

router.post("/login", async (req, res) => {
  const token: string = req.headers.authorization;
  const payload = await getPayloadFromGoogle(token);
  if (!payload) {
    res.status(401).send("Invalid google auth token");
  }

  const orgDomain = process.env.ORG_DOMAIN || "connect.hku.hk";
  if (payload.hd !== orgDomain) {
    res
      .status(401)
      .send(
        "Not using valid email address. Check if the email address ends with @connect.hku.hk"
      );
    return;
  }

  // Get the user from the email address.
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });
  if (user) {
    const token = await createUserSessionToken(user);

    res
      .status(200)
      .send({ registered: user.registered, logged_in: true, token });
    return;
  } else {
    const uniqueUsername = await generateUniqueUsername();

    const newUser = await prisma.user.create({
      data: {
        username: uniqueUsername,
        email: payload.email,
        image_url: payload.picture,
        first_name: payload.given_name,
        last_name: payload.family_name,
        role: Role.USER,
      },
    });

    const token = await createUserSessionToken(newUser);

    res
      .status(200)
      .send({ registered: user.registered, logged_in: true, token });
  }
});

export { router as auth };
