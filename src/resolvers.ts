import { UserQueryResolvers } from "./query/user";
import { UserMutationResolvers } from "./mutations/user";
import { WasherQueryResolvers } from "./query/washers";
import { BookingQueryResolvers, RoomQueryResolvers } from "./query/bookings";
import { BookingMutationResolvers } from "./mutations/bookings";
import { EventQueryResolvers } from "./query/events";
import {
  createEvent,
  deleteEvent,
  addEventSubscriber,
  removeEventSubscriber,
} from "./mutations/events";
import { createComment, deleteComment } from "./mutations/comments";

import { relationResolvers } from "./generated/typegraphql-prisma";

const customResolvers = [
  UserQueryResolvers,
  UserMutationResolvers,
  WasherQueryResolvers,
  BookingQueryResolvers,
  RoomQueryResolvers,
  BookingMutationResolvers,
  EventQueryResolvers,
];

const generatedResolvers = [...relationResolvers];

export const resolvers = [...customResolvers, ...generatedResolvers];
