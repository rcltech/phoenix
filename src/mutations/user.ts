import * as env from "dotenv";
import { OAuth2Client, VerifyIdTokenOptions } from "google-auth-library";
import { User } from "../generated/prisma-client";
import { TokenPayload } from "google-auth-library/build/src/auth/loginticket";

env.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createUser = (
  parent,
  { username, email, image_url, phone, first_name, last_name, room_no },
  ctx
) =>
  ctx.prisma.createUser({
    username,
    email,
    image_url,
    phone,
    first_name,
    last_name,
    room_no,
  });

const deleteUser = (parent, { username }, ctx) =>
  ctx.prisma.deleteUser({ username });

const login = async (parent, { id_token }, ctx) => {
  try {
    await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
  } catch (e) {
    return { token: null, login_status: false, register: false };
  }
  const ticket = await client.verifyIdToken({
    idToken: id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload: TokenPayload = ticket.getPayload();
  if (payload && payload.hd !== "connect.hku.hk")
    return { token: null, login_status: false, register: false };
  const user: User = await ctx.prisma.user({ email: payload.email });
  if (user === null)
    return { token: null, login_status: false, register: true };
  return { token: id_token, login_status: true, register: false };
};

const register = async (parent, { user, id_token }, ctx) => {
  try {
    await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
  } catch (e) {
    console.log(e);
    return null;
  }
  const ticket = await client.verifyIdToken({
    idToken: id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload: TokenPayload = ticket.getPayload();
  if (payload && payload.hd !== "connect.hku.hk") return null;
  const createdUser = await ctx.prisma.createUser({
    username: user.username,
    email: payload.email,
    image_url: payload.picture,
    phone: user.phone,
    first_name: payload.given_name,
    last_name: payload.family_name,
    room_no: user.room_no,
  });
  return { user: createdUser, token: id_token };
};


export { createUser, deleteUser, login, register };
