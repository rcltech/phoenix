import { Washer } from "@prisma/client";
import jwt from "jsonwebtoken";
import assert from "assert";
import { AppContext } from "../context";

const updateWasher = async (
  parent,
  { id, in_use },
  ctx: AppContext
): Promise<Washer> => {
  try {
    const secretString: string = (await jwt.verify(
      ctx.token,
      process.env.SLS_SECRET
    )) as string;
    assert.strictEqual(secretString, "sls to phoenix");
    // same string is sent from sls lambda function
  } catch (e) {
    return null;
  }
  return ctx.prisma.washer.update({
    data: {
      in_use,
    },
    where: {
      id,
    },
  });
};

export { updateWasher };
