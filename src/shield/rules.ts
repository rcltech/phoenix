import { rule } from "graphql-shield";
import { AppContext } from "../context";
import { User } from "../generated/prisma-client";

export const isAuthenticated = rule({ cache: "contextual" })(
  async (parent, args, ctx: AppContext) => {
    return ctx.auth.isAuthenticated;
  }
);

export const isAdmin = rule({ cache: "contextual" })(
  async (parent, args, ctx: AppContext) => {
    return ctx.auth.user.role === "ADMIN";
  }
);

export const isBookingCreator = rule({ cache: "contextual" })(
  async (parent, args, ctx: AppContext) => {
    const currentUser: User = ctx.auth.user;
    const bookingUser: User = await ctx.prisma.booking({ id: args.id }).user();
    return currentUser.id === bookingUser.id;
  }
);
