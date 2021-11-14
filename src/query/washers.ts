import { Arg, Ctx, Query, Resolver } from "type-graphql";
import { Washer, WasherWhereInput } from "../generated/typegraphql-prisma";
import { AppContext } from "../context";

@Resolver()
export class WasherQueryResolvers {
  @Query(() => [Washer])
  async washers(
    @Arg("data", { nullable: true }) data: WasherWhereInput,
    @Ctx() ctx: AppContext
  ): Promise<Washer[]> {
    return ctx.prisma.washer.findMany({ where: data, orderBy: { id: "asc" } });
  }
}
