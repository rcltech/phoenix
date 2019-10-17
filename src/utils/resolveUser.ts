import { OAuth2Client } from "google-auth-library";
import { TokenPayload } from "google-auth-library/build/src/auth/loginticket";
import * as jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function resolveUserUsingGoogle(ctx) {
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

function resolveUserUsingJWT(token: string) {
  return jwt.verify(token, process.env.PRISMA_SECRET);
}
export { resolveUserUsingGoogle, resolveUserUsingJWT };
