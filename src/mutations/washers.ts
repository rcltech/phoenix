import { Washer } from "../generated/prisma-client";
import jwt from "jsonwebtoken";
import assert from "assert";

const updateWasher = async (parent, { id, in_use }, ctx): Promise<Washer> => {
  try {
    const secretString: string = jwt.verify(
      ctx.token,
      process.env.SLS_SECRET
    ) as string;
    assert.strictEqual(secretString, "sls to phoenix");
    // same string is sent from sls lambda function
  } catch (e) {
    return null;
  }
  return ctx.prisma.updateWasher({
    data: {
      in_use,
    },
    where: {
      id,
    },
  });
};

export { updateWasher };
