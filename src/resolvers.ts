import { login, register } from "./mutations/user";
import { user, me } from "./query/user";
import { washers } from "./query/washers";
import { bookings, rooms } from "./query/bookings";
import { events } from "./query/events";
import { updateWasher } from "./mutations/washers";
import {
  createBooking,
  updateBooking,
  deleteBooking,
} from "./mutations/bookings";
import {
  createEvent,
  deleteEvent,
  addEventSubscriber,
  removeEventSubscriber,
} from "./mutations/events";
import { createComment, deleteComment } from "./mutations/comments";
import { IResolvers } from "apollo-server-express";
import { Booking, Room, User, Event, Comment } from "@prisma/client";
import { AppContext } from "./context";

export const resolvers: IResolvers = {
  Query: {
    user,
    me,
    washers,
    bookings,
    rooms,
    events,
  },
  Mutation: {
    login,
    register,
    updateWasher,
    createBooking,
    updateBooking,
    deleteBooking,
    createEvent,
    deleteEvent,
    addEventSubscriber,
    removeEventSubscriber,
    createComment,
    deleteComment,
  },
  User: {
    roomBookings(parent, args, ctx: AppContext): Promise<Booking[]> {
      return ctx.prisma.booking.findMany({
        where: { user: { id: { equals: parent.id } } },
      });
    },
    eventsOrganised(parent, args, ctx: AppContext): Promise<Event[]> {
      return ctx.prisma.event.findMany({
        where: { organiser: { id: { equals: parent.id } } },
      });
    },
    eventsSubscribed(parent, args, ctx: AppContext): Promise<Event[]> {
      return ctx.prisma.user
        .findUnique({ where: { id: parent.id } })
        .eventsSubscribed();
    },
    password: (): null => null,
  },
  Booking: {
    room(parent, _, ctx: AppContext): Promise<Room> {
      return ctx.prisma.room.findUnique({ where: { id: parent.roomId } });
    },
    user(parent, _, ctx: AppContext): Promise<User> {
      return ctx.prisma.user.findUnique({ where: { id: parent.userId } });
    },
  },
  Room: {
    bookings(parent, _, ctx): Promise<Booking[]> {
      return ctx.prisma.booking.findMany({
        where: { room: { id: { equals: parent.id } } },
      });
    },
  },
  Event: {
    organiser(parent, _, ctx: AppContext): Promise<User> {
      return ctx.prisma.user.findUnique({ where: { id: parent.organiserId } });
    },
    subscribers(parent, _, ctx: AppContext): Promise<User[]> {
      return ctx.prisma.event
        .findUnique({ where: { id: parent.id } })
        .subscribers();
    },
    comments(parent, _, ctx: AppContext): Promise<Comment[]> {
      return ctx.prisma.event
        .findUnique({ where: { id: parent.id } })
        .comments();
    },
  },
  Comment: {
    event(parent, _, ctx: AppContext): Promise<Event> {
      return ctx.prisma.event.findUnique({ where: { id: parent.eventId } });
    },
    user(parent, _, ctx): Promise<User> {
      return ctx.prisma.user.findUnique({ where: { id: parent.userId } });
    },
  },
};
