import * as env from "dotenv";
import * as jwt from "jsonwebtoken";
import { User } from "../generated/prisma-client";
env.config();

const generateToken = (user: User) => {
  return jwt.sign(user, process.env.PRISMA_SECRET);
};

export { generateToken };
