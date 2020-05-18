import { shield, and } from "graphql-shield";
import {
  isAuthenticated,
  isAdmin,
  isBookingCreator,
  isEventCreator,
  isCommentCreator,
} from "./rules";

export const permissions = shield({
  Query: {
    user: isAuthenticated,
    me: isAuthenticated,
  },
  Mutation: {
    createBooking: isAuthenticated,
    updateBooking: and(isAuthenticated, isBookingCreator),
    deleteBooking: and(isAuthenticated, isBookingCreator),
    createEvent: isAuthenticated,
    deleteEvent: and(isAuthenticated, isEventCreator),
    addEventSubscriber: isAuthenticated,
    removeEventSubscriber: isAuthenticated,
    createComment: isAuthenticated,
    deleteComment: and(isAuthenticated, isCommentCreator),
  },
});
