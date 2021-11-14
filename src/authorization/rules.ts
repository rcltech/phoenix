import { Rule } from "typegraphql-authchecker";
import { AppContext } from "../context";
import { Role } from "../generated/typegraphql-prisma";

export const isAuthenticated: Rule<AppContext> = async ({ context }) => {
  return context.auth.isAuthenticated;
};

export const isAdmin: Rule<AppContext> = async ({ context }) => {
  return context.auth.user.role === Role.ADMIN;
};

export const isBookingCreator: Rule<AppContext> = async ({ args, context }) => {
  const currentUser = context.auth.user;
  const { user: bookingUser } = await context.prisma.booking.findUnique({
    where: { id: args.id },
    select: { id: true, user: { select: { id: true } } },
  });
  return currentUser.id === bookingUser.id;
};

export const isEventOrganiser: Rule<AppContext> = async ({ args, context }) => {
  const currentUser = context.auth.user;
  const { organiser } = await context.prisma.event.findUnique({
    where: { id: args.id },
    select: { id: true, organiser: { select: { id: true } } },
  });
  return currentUser.id === organiser.id;
};

export const isCommentAuthor: Rule<AppContext> = async ({ args, context }) => {
  const currentUser = context.auth.user;
  const { user: commentCreator } = await context.prisma.comment.findUnique({
    where: { id: args.id },
    select: { id: true, user: { select: { id: true } } },
  });
  return currentUser.id === commentCreator.id;
};
