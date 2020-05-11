import { shield, and } from "graphql-shield";
import { isAuthenticated, isAdmin } from "./rules";

export const permissions = shield({
  Query: {
    user: isAuthenticated,
    me: isAuthenticated,
  },
  Mutation: {
    createBooking: isAuthenticated,
    updateBooking: isAuthenticated,
    deleteBooking: isAuthenticated,
    createEvent: isAuthenticated,
    deleteEvent: isAuthenticated,
    addEventSubscriber: isAuthenticated,
    removeEventSubscriber: isAuthenticated,
    createComment: isAuthenticated,
    deleteComment: isAuthenticated,
  },
});
