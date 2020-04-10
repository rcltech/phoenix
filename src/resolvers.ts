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
} from "./mutations/events/index";
import { IResolvers } from "apollo-server-express";
import { Booking, Room, User, Event } from "./generated/prisma-client";

const resolvers: IResolvers = {
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
  },
  User: {
    roomBookings(parent, args, ctx): Promise<[Booking]> {
      return ctx.prisma.user({ id: parent.id }).roomBookings();
    },
    eventsOrganised(parent, args, ctx): Promise<[Event]> {
      return ctx.prisma.user({ id: parent.id }).eventsOrganised();
    },
    eventsSubscribed(parent, args, ctx): Promise<[Event]> {
      return ctx.prisma.user({ id: parent.id }).eventsSubscribed();
    },
  },
  Booking: {
    room(parent, _, ctx): Promise<Room> {
      return ctx.prisma.booking({ id: parent.id }).room();
    },
    user(parent, _, ctx): Promise<User> {
      return ctx.prisma.booking({ id: parent.id }).user();
    },
  },
  Room: {
    bookings(parent, _, ctx): Promise<[Booking]> {
      return ctx.prisma.room({ id: parent.id }).bookings();
    },
  },
  Event: {
    organiser(parent, _, ctx): Promise<User> {
      return ctx.prisma.event({ id: parent.id }).organiser();
    },
    subscribers(parent, _, ctx): Promise<[User]> {
      return ctx.prisma.event({ id: parent.id }).subscribers();
    },
  },
};

export default resolvers;
