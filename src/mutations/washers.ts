import { Arg, Ctx, ID, Mutation, Resolver } from "type-graphql";
import { Washer } from "../generated/typegraphql-prisma";
import { AppContext } from "../context";
import jwt from "jsonwebtoken";
import assert from "assert";

@Resolver()
export class WasherMutationResolvers {
  @Mutation(() => Washer)
  async updateWasher(
    @Arg("id", () => ID) id: string,
    @Arg("in_use") in_use: boolean,
    @Ctx() ctx: AppContext
  ): Promise<Washer> {
    try {
      const secretString: string = (await jwt.verify(
        ctx.token,
        process.env.SLS_SECRET
      )) as string;
      assert.strictEqual(secretString, "sls to phoenix");
      // same string is sent from sls lambda function
    } catch (e) {
      console.error(e);
      throw new Error("Invalid sls token");
    }
    return ctx.prisma.washer.update({
      data: {
        in_use,
      },
      where: {
        id,
      },
    });
  }
}
