import { UserQueryResolvers } from "./query/user";
import { UserMutationResolvers } from "./mutations/user";
import { WasherQueryResolvers } from "./query/washers";
import { WasherMutationResolvers } from "./mutations/washers";
import { BookingQueryResolvers, RoomQueryResolvers } from "./query/bookings";
import { BookingMutationResolvers } from "./mutations/bookings";
import { EventQueryResolvers } from "./query/events";
import {
  EventMutationResolvers,
  EventSubscribersMutationResolvers,
} from "./mutations/events";
import { CommentMutationResolvers } from "./mutations/comments";

import { relationResolvers } from "./generated/typegraphql-prisma";

const customResolvers = [
  UserQueryResolvers,
  UserMutationResolvers,
  WasherQueryResolvers,
  WasherMutationResolvers,
  BookingQueryResolvers,
  RoomQueryResolvers,
  BookingMutationResolvers,
  EventQueryResolvers,
  EventMutationResolvers,
  EventSubscribersMutationResolvers,
  CommentMutationResolvers,
];

const generatedResolvers = [...relationResolvers];

export const resolvers = [...customResolvers, ...generatedResolvers];
