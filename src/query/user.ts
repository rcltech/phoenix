import { TokenPayload } from "google-auth-library/build/src/auth/loginticket";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const user = (parent, { username }, ctx) =>
    ctx.prisma.user({
        username,
    });

const me = async (parent, {} , ctx) => {
  try {
    await client.verifyIdToken({
      idToken: ctx.token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
  } catch (e) {
    console.log(e);
    return null;
  }
  const ticket = await client.verifyIdToken({
    idToken: ctx.token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload: TokenPayload = ticket.getPayload();
  return ctx.prisma.user({email: payload.email});
};

export {user, me};