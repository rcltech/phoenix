import { OAuth2Client } from "google-auth-library";
import { TokenPayload } from "google-auth-library/build/src/auth/loginticket";
import * as jwt from "jsonwebtoken";
import { User } from "../generated/prisma-client";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function resolveUserUsingGoogle(ctx) : Promise<User> {
  try {
    await client.verifyIdToken({
      idToken: ctx.token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
  } catch (e) {
    return null;
  }
  const ticket = await client.verifyIdToken({
    idToken: ctx.token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload: TokenPayload = ticket.getPayload();
  if (payload && payload.hd !== "connect.hku.hk") return null;
  return ctx.prisma.user({ email: payload.email });
}

async function resolveUserUsingJWT(ctx : any) : Promise<User> {
  const userSession: any = jwt.verify(ctx.token, process.env.PRISMA_SECRET);
  const sessionId = userSession.id;
  return ctx.prisma.userSessions({ id: sessionId }).user();
}

export { resolveUserUsingGoogle, resolveUserUsingJWT };
