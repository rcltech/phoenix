import { shield, and } from "graphql-shield";
import { isAuthenticated, isAdmin, isBookingCreator } from "./rules";

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
    deleteEvent: isAuthenticated,
    addEventSubscriber: isAuthenticated,
    removeEventSubscriber: isAuthenticated,
    createComment: isAuthenticated,
    deleteComment: isAuthenticated,
  },
});
