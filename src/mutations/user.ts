import * as env from "dotenv";
import { OAuth2Client } from "google-auth-library";
import {
  Admin,
  Credential,
  prisma,
  User,
  UserSessions,
} from "../generated/prisma-client";
import { TokenPayload } from "google-auth-library/build/src/auth/loginticket";
import { generateToken } from "../utils/authToken";
import { hash, compare } from "bcrypt";
import * as assert from "assert";

env.config();

const client: OAuth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

type LoginResponse = {
  login_status: boolean;
  register: boolean;
  token?: string;
};

export const login = async (parent, args, ctx): Promise<LoginResponse> => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: ctx.token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload: TokenPayload = ticket.getPayload();
    // Check if the user email is an HKU email address
    if (payload && payload.hd !== "connect.hku.hk")
      return { token: null, login_status: false, register: false };
    const user: User = await ctx.prisma.user({ email: payload.email });
    // If the user does not exist, return that the user needs to be registered
    if (user === null)
      return { token: null, login_status: false, register: true };
    // If the user is valid, then register a user session and return a to
    const userSession: UserSessions = await ctx.prisma.createUserSessions({
      user: {
        connect: {
          id: user.id,
        },
      },
    });
    console.log(userSession);
    const jwtToken = generateToken(userSession);
    return { token: jwtToken, login_status: true, register: false };
  } catch (e) {
    console.log(e);
    return { token: null, login_status: false, register: false };
  }
};

export const register = async (parent, { user }, ctx): Promise<User> | null => {
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
  return ctx.prisma.createUser({
    username: user.username,
    email: payload.email,
    image_url: payload.picture,
    phone: user.phone,
    first_name: payload.given_name,
    last_name: payload.family_name,
    room_no: user.room_no,
  });
};

export const adminLogin = async (
  parent,
  { username, password }: { username: string; password: string },
  ctx
): Promise<LoginResponse> => {
  const savedCredential: Credential = await ctx.prisma
    .admin({
      username,
    })
    .credential();
  const matches: boolean = await compare(password, savedCredential.password);
  if (matches) {
    return {
      token: "",
      login_status: true,
      register: false,
    };
  }
  return null;
};

export const adminRegister = async (
  parent,
  { username, password },
  ctx
): Promise<Admin> => {
  assert.strictEqual(ctx.token, process.env.PRISMA_SECRET, "Not allowed");
  const hashedPassword = await hash(password, 10);
  return ctx.prisma.createAdmin({
    username,
    credential: {
      create: {
        password: hashedPassword,
      },
    },
  });
};
