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

export const isEventCreator = rule({ cache: "contextual" })(
  async (parent, args, ctx: AppContext) => {
    const currentUser: User = ctx.auth.user;
    const eventOrganiser: User = await ctx.prisma
      .event({ id: args.id })
      .organiser();
    return currentUser.id === eventOrganiser.id;
  }
);

export const isCommentCreator = rule({ cache: "contextual" })(
  async (parent, args, ctx: AppContext) => {
    const currentUser: User = ctx.auth.user;
    const commentCreator: User = await ctx.prisma
      .comment({ id: args.commentId })
      .user();
    return currentUser.id === commentCreator.id;
  }
);
