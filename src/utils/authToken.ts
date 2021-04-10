import * as env from "dotenv";
import * as jwt from "jsonwebtoken";
import { UserSession } from "@prisma/client";

env.config();

const generateToken = (session: UserSession): string => {
  return jwt.sign(session, process.env.PHOENIX_SECRET);
};

export { generateToken };
