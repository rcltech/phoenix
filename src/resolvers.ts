// import { login, register } from "./mutations/user";
import { user, me } from "./query/user";
// import { washers } from "./query/washers";
// import { bookings, rooms } from "./query/bookings";
// import { events } from "./query/events";
// import { updateWasher } from "./mutations/washers";
// import {
//   createBooking,
//   updateBooking,
//   deleteBooking,
// } from "./mutations/bookings";
// import {
//   createEvent,
//   deleteEvent,
//   addEventSubscriber,
//   removeEventSubscriber,
// } from "./mutations/events/index";
// import { createComment, deleteComment } from "./mutations/comments";
import { IResolvers } from "apollo-server-express";
import { Booking, Room, User, Event, Comment } from "@prisma/client";

export const resolvers: IResolvers = {
  Query: {
    user,
    me,
    // washers,
    // bookings,
    // rooms,
    // events,
  },
  // Mutation: {
  //   login,
  //   register,
  //   updateWasher,
  //   createBooking,
  //   updateBooking,
  //   deleteBooking,
  //   createEvent,
  //   deleteEvent,
  //   addEventSubscriber,
  //   removeEventSubscriber,
  //   createComment,
  //   deleteComment,
  // },
  User: {
    roomBookings(parent, args, ctx): Booking[] {
      // return ctx.prisma.user
      //   .findUnique({ where: { id: parent.id } })
      //   .roomBookings();
      return [];
    },
    eventsOrganised(parent, args, ctx): Event[] {
      // return ctx.prisma.user({ id: parent.id }).eventsOrganised();
      return [];
    },
    eventsSubscribed(parent, args, ctx): Event[] {
      // return ctx.prisma.user({ id: parent.id }).eventsSubscribed();
      return [];
    },
    password: (parent, args, ctx): null => {
      return null;
    },
  },
  // Booking: {
  //   room(parent, _, ctx): Promise<Room> {
  //     return ctx.prisma.booking({ id: parent.id }).room();
  //   },
  //   user(parent, _, ctx): Promise<User> {
  //     return ctx.prisma.booking({ id: parent.id }).user();
  //   },
  // },
  // Room: {
  //   bookings(parent, _, ctx): Promise<[Booking]> {
  //     return ctx.prisma.room({ id: parent.id }).bookings();
  //   },
  // },
  // Event: {
  //   organiser(parent, _, ctx): Promise<User> {
  //     return ctx.prisma.event({ id: parent.id }).organiser();
  //   },
  //   subscribers(parent, _, ctx): Promise<[User]> {
  //     return ctx.prisma.event({ id: parent.id }).subscribers();
  //   },
  //   comments(parent, _, ctx): Promise<[Comment]> {
  //     return ctx.prisma.event({ id: parent.id }).comments();
  //   },
  // },
  // Comment: {
  //   event(parent, _, ctx): Promise<Event> {
  //     return ctx.prisma.comment({ id: parent.id }).event();
  //   },
  //   user(parent, _, ctx): Promise<User> {
  //     return ctx.prisma.comment({ id: parent.id }).user();
  //   },
  // },
};
