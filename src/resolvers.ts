import { login, register } from "./mutations/user";
import { user, me } from "./query/user";
import { washers } from "./query/washers";
import { bookings, rooms } from "./query/bookings";
import { events } from "./query/events";
import {
  createBooking,
  updateBooking,
  deleteBooking,
} from "./mutations/bookings";
import { createEvent, deleteEvent } from "./mutations/events";
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
    createBooking,
    updateBooking,
    deleteBooking,
    createEvent,
    deleteEvent,
  },
  User: {
    roomBookings(parent, args, ctx): Promise<[Booking]> {
      return ctx.prisma.user({ id: parent.id }).roomBookings();
    },
    eventsOrganised(parent, args, ctx): Promise<[Event]> {
      return ctx.prisma.user({ id: parent.id }).eventsOrganised();
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
  },
};

export default resolvers;
