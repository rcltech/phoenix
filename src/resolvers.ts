import { register } from "./mutations/user";
import { UserQueryResolvers } from "./query/user";
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

import { relationResolvers } from "@generated/type-graphql";

const customResolvers = [UserQueryResolvers];

const generatedResolvers = [...relationResolvers];

export const resolvers = [...customResolvers, ...generatedResolvers];
