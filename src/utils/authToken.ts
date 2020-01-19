import * as env from "dotenv";
import * as jwt from "jsonwebtoken";
import { UserSessions } from "../generated/prisma-client";

env.config();

const generateToken = (session: UserSessions): string => {
  return jwt.sign(session, process.env.PRISMA_SECRET);
};

export { generateToken };
