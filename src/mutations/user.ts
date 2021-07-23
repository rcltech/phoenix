import * as env from "dotenv";
import { OAuth2Client } from "google-auth-library";
import { User, UserSession, Role } from "@prisma/client";
import { TokenPayload } from "google-auth-library/build/src/auth/loginticket";
import { generateToken } from "../utils/authToken";
import { AppContext } from "../context";

env.config();

const client: OAuth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

type LoginResponse = {
  login_status: boolean;
  register: boolean;
  token?: string;
};

const register = async (
  parent,
  { user },
  ctx: AppContext
): Promise<User> | null => {
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
  if (payload && payload.hd !== "connect.hku.hk") return null;
  return ctx.prisma.user.create({
    data: {
      username: user.username,
      email: payload.email,
      image_url: payload.picture,
      phone: user.phone,
      first_name: payload.given_name,
      last_name: payload.family_name,
      room_no: user.room_no,
      role: Role.USER,
    },
  });
};

export { register };
