import * as env from "dotenv";
import {
  Arg,
  Authorized,
  Ctx,
  Field,
  InputType,
  Mutation,
  Resolver,
} from "type-graphql";
import { User } from "../generated/typegraphql-prisma";

import { AppContext } from "../context";
import { isAuthenticated } from "../authorization/rules";

env.config();

@InputType()
class UserRegisterInput {
  @Field(() => String)
  username: string;

  @Field(() => String)
  phone: string;

  @Field(() => String)
  room_no: string;
}

@Resolver()
export class UserMutationResolvers {
  @Authorized(isAuthenticated)
  @Mutation(() => User)
  async register(
    @Arg("user") user: UserRegisterInput,
    @Ctx() ctx: AppContext
  ): Promise<User> {
    return ctx.prisma.user.update({
      where: {
        id: ctx.auth.user.id,
      },
      data: {
        username: user.username,
        phone: user.phone,
        room_no: user.room_no,
        registered: true,
      },
    });
  }
}
