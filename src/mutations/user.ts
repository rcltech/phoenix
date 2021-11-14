import * as env from "dotenv";
import { Arg, Ctx, Field, InputType, Mutation, Resolver } from "type-graphql";
import { User, Role } from "../generated/typegraphql-prisma";

import { AppContext } from "../context";
import { OAuth2Client } from "google-auth-library";
import { TokenPayload } from "google-auth-library/build/src/auth/loginticket";

env.config();

const client: OAuth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
  @Mutation(() => User)
  async register(
    @Arg("user") user: UserRegisterInput,
    @Ctx() ctx: AppContext
  ): Promise<User> {
    try {
      await client.verifyIdToken({
        idToken: ctx.token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch (e) {
      console.error(e);
      throw new Error("Unable to verify user on google auth");
    }

    const ticket = await client.verifyIdToken({
      idToken: ctx.token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload: TokenPayload = ticket.getPayload();

    if (!payload) throw new Error("Token payload undefined");

    if (payload.hd !== "connect.hku.hk")
      throw new Error("User's email is not from the connect.hku.hk domain");

    return ctx.prisma.user.create({
      data: {
        username: user.username,
        email: payload.email,
        image_url: payload.picture,
        phone: user.phone,
        first_name: payload.given_name,
        last_name: payload.family_name,
        room_no: user.room_no,
        role: Role.USER,
      },
    });
  }
}
