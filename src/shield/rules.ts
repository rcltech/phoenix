import { rule } from "graphql-shield";

import { AppContext } from "../context";

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
    const currentUser = ctx.auth.user;
    const { user: bookingUser } = await ctx.prisma.booking.findUnique({
      where: { id: args.id },
      select: { id: true, user: { select: { id: true } } },
    });
    return currentUser.id === bookingUser.id;
  }
);

export const isEventOrganiser = rule({ cache: "contextual" })(
  async (parent, args, ctx: AppContext) => {
    const currentUser = ctx.auth.user;
    const { organiser } = await ctx.prisma.event.findUnique({
      where: { id: args.id },
      select: { id: true, organiser: { select: { id: true } } },
    });
    return currentUser.id === organiser.id;
  }
);

export const isCommentAuthor = rule({ cache: "contextual" })(
  async (parent, args, ctx: AppContext) => {
    const currentUser = ctx.auth.user;
    const { user: commentCreator } = await ctx.prisma.comment.findUnique({
      where: { id: args.id },
      select: { id: true, user: { select: { id: true } } },
    });
    return currentUser.id === commentCreator.id;
  }
);
