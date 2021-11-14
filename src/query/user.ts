import { Arg, Authorized, Ctx, Query, Resolver } from "type-graphql";
import { User } from "../generated/typegraphql-prisma";
import { AppContext } from "../context";
import { isAuthenticated } from "../authorization/rules";

@Resolver()
export class UserQueryResolvers {
  @Authorized(isAuthenticated)
  @Query(() => User)
  me(@Ctx() ctx: AppContext): User {
    return ctx.auth.user;
  }

  @Authorized(isAuthenticated)
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
