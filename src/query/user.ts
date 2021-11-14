import { Arg, Ctx, Query, Resolver } from "type-graphql";
import { User } from "../generated/typegraphql-prisma";
import { AppContext } from "../context";

@Resolver()
export class UserQueryResolvers {
  @Query(() => User)
  me(@Ctx() ctx: AppContext): User {
    return ctx.auth.user;
  }

  @Query(() => User)
  user(
    @Ctx() ctx: AppContext,
    @Arg("username") username: string
  ): Promise<User> {
    return ctx.prisma.user.findUnique({
      where: { username },
    });
  }
}
