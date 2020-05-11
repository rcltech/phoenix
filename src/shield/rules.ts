import { rule, shield, and, or, not } from "graphql-shield";
import { AppContext } from "../server";

export const isAuthenticated = rule({ cache: "contextual" })(
  async (parent, args, ctx: AppContext) => {
    return ctx.auth.isAuthenticated;
  }
);

export const isAdmin = rule({ cache: "contextual" })(
  async (parent, args, ctx: AppContext) => {
    return ctx.auth.user.role === "ADMIN";
  }
);
