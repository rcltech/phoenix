import { login, register } from "./mutations/user";
import { user, me } from "./query/user";
import washer from "./query/washer";
import { bookings, rooms } from "./query/bookings";
import {
  createBooking,
  updateBooking,
  deleteBooking,
} from "./mutations/bookings";
import { IResolvers } from "apollo-server-express";
import { Booking, Room, User } from "./generated/prisma-client";

const resolvers: IResolvers = {
  Query: {
    user,
    me,
    washer,
    bookings,
    rooms,
  },
  Mutation: {
    login,
    register,
    createBooking,
    updateBooking,
    deleteBooking,
  },
  User: {
    roomBookings(parent, args, ctx): Promise<[Booking]> {
      return ctx.prisma.user({ id: parent.id }).roomBookings();
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
};

export default resolvers;
